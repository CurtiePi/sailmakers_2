const mongoose          = require('mongoose');
const Customer          = require('../models/customers');
const Salesperson       = require('../models/salespeople');
const Quote             = require('../models/quotes');
const Port              = require('../models/ports');


module.exports = {
    /**
     * List all customers in the database
     *
     */
    listCustomers: async () => {
        try {
            let customers = await Customer.find()
                                          .populate({
                                              path: 'quotes',
                                              populate: [{
                                                path: 'customer',
                                                model: 'Customer'
                                              },
                                              { path: 'salesperson',
                                                model: 'Salesperson'
                                              }]
                                           });

            return customers;
        }
        catch (err) {
            console.log('Received an error getting customer listing');
        }
    },

    /**
     * Get specific customers by id
     *
     */
    getCustomerById: async (id) => {
        try {
            var user_id = mongoose.Types.ObjectId(id);
            let customer = await Customer.findById({_id: user_id});
            return customer;
        }
        catch (err) {
            console.log('Received an error getting customer');
        }
    },
    createCustomer: async (customer_data) => {
        try {
            var customer = new Customer(customer_data);
            await customer.save();

            return customer;
        }
        catch(err) {
            console.log('Received an error creating customer');
        }
    },

    /**
     * Find specific customers based on criteria
     *
     */
    findCustomers: async (criteria) => {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let customers = await Customer.find(criteria)
                                          .populate('quotes')
            return customers;
        }
        catch (err) {
            console.log('Received an error finding customer');
        }
    },
    /**
     * Update specific customer
     *
     */
    updateCustomer: async (criteria, update ) => {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let customer = await Customer.findOneAndUpdate(criteria, update, {new: true});
            return customer;
        }
        catch (err) {
            console.log('Received an error updating customer');
        }
    },
    /**
     * Delete Customer
     *
     */
    deleteCustomer: async (customer) => {
        var c_id = mongoose.Types.ObjectId(customer._id);
        var c_quotes = customer.quotes;
        var quote_ids = [];
        var sales_ids = [];
        var sales_controller = [];
        var pdf_list = [];
        for (var idx=0; idx < c_quotes.length; idx++) {
            var quote = c_quotes[idx];
            quote_ids.push(mongoose.Types.ObjectId(quote._id));
            pdf_list.push(...quote.doc_path);
            if (! sales_controller.includes(quote.salesperson._id)) {
                sales_controller.push(quote.salesperson._id);
                sales_ids.push(mongoose.Types.ObjectId(quote.salesperson._id));
            }
        }

        try {
            // Need to remove quote from the and salesperson
            if (quote_ids.length > 0) {
              await Quote.deleteMany({_id: {$in: quote_ids}});
              await Salesperson.updateMany({_id: {$in: sales_ids}}, {$pull: {quotes: {$in:quote_ids}}});
            }
            await Customer.deleteOne({_id: c_id});


            return pdf_list;
        }
        catch(err) {
            console.log('Received an error deleting customer');
        }
    },

    listQuotes: async () => {
        try {
            let quotes = await Quote.find()
                                    .sort({createAt: -1})
                                    .populate('customer')
            return quotes;
        }
        catch(err) {
            console.log('Received an error getting quote listing');
        }
    },
    getQuoteById: async (id) => {
        try {
            var quote_id = mongoose.Types.ObjectId(id);
            let quote = await Quote.findById({_id: quote_id});
            return quote;
        }
        catch(err) {
            console.log('Received an error getting quote');
        }
    },
    getCustomerQuotes: async (cid) => {
        try {
            var customer_id = mongoose.Types.ObjectId(cid);
            let quotes = await Quote.find({customer: customer_id})
                                    .sort({createAt: -1})
                                    .populate('customer')
                                    .populate('salesperson');
            return quotes;
        }
        catch(err) {
            console.log('Received an error getting quote');
        }
    },
    createQuote: async (quote_data) => {
        try {
            // Make sure customer id and salesperson id are Object ids
            customer_id = mongoose.Types.ObjectId(quote_data.customer_id);
            salesper_id = mongoose.Types.ObjectId(quote_data.salesperson_id);

            quote_data.customer = customer_id;
            quote_data.salesperson = salesper_id;

            delete quote_data['customer_id'];
            delete quote_data['salesperson_id'];

            var quote = new Quote(quote_data);
            await quote.save();

            // Need to populate the customer and salesperson with the quote
            await Customer.findOneAndUpdate({_id: customer_id}, {$push: {quotes: quote._id}});
            await Salesperson.findOneAndUpdate({_id: salesper_id}, {$push: {quotes: quote._id}});
            
            await Quote.populate(quote, { path: "customer" });
            await Quote.populate(quote, { path: "salesperson" });

            return quote;
        }
        catch(err) {
            console.log('Received an error creating quote');
        }
    },
    deleteQuote: async (quote) => {
        var q_id = mongoose.Types.ObjectId(quote._id);
        var c_id = mongoose.Types.ObjectId(quote.customer._id);
        var s_id = mongoose.Types.ObjectId(quote.salesperson._id);

        try {
            var pdf_list = quote.doc_path;

            // Need to remove quote from the customer and salesperson
            await Customer.findOneAndUpdate({_id: c_id}, {$pull: {quotes: q_id}});
            await Salesperson.findOneAndUpdate({_id: s_id}, {$pull: {quotes: q_id}});
            
            await Quote.deleteOne({_id: q_id});
            return pdf_list
        }
        catch(err) {
            console.log('Received an error deleting quote');
        }
    },
    /**
     * Find specific quotes by crtiteria
     *
     */
    findQuotes: async (criteria) => {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let quotes = await Quote.find(criteria)
                                    .sort({createAt: -1})
                                    .populate('customer')
            return quotes;
        }
        catch (err) {
            console.log(`Received an error searching quotes ${err}`);
        }
    },
    /**
     * Update specific quote
     *
     */
    updateQuote: async (criteria, update ) => {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let quote = await Quote.findOneAndUpdate(criteria, update, {new: true});
            await Quote.populate(quote, { path: "customer" });
            await Quote.populate(quote, { path: "salesperson" });
            return quote;
        }
        catch (err) {
            console.log('Received an error updating quote');
        }
    },
    addQuoteDoc: async (quoteId, filePath ) => {
        const criteria = { '_id': mongoose.Types.ObjectId(quoteId) };

        try {
            let quote = await Quote.findByIdAndUpdate(criteria, { $push: { doc_path: filePath} }, {new: true});
            await Quote.populate(quote, { path: "customer" });
            await Quote.populate(quote, { path: "salesperson" });
            return quote;
        }
        catch (err) {
            console.log('Received an error updating quote');
        }
    },

    getSalespeople: async () => {
        try {
            let salespeople = await Salesperson.find();
            return salespeople;
        }
        catch(err) {
            console.log('Received an error getting listing of salespeople');
        }
    },
    getSalespersonById: async (id) => {
        try {
            var salesperson_id = mongoose.Types.ObjectId(id);
            let salesperson = await Salesperson.findById({_id: salesperson_id});
            return salesperson;
        }
        catch(err) {
            console.log('Received an error getting salesperson');
        }
    },
    getSalespersonByName: async (name_param) => {
        try {
            var nameArr= name_param.split(' ');
            let salesperson = await Salesperson.find({lname: nameArr[1], fname: nameArr[0]});
            return salesperson;
        }
        catch(err) {
            console.log('Received an error getting salesperson');
        }
    },
    createSalesperson: async (salesperson_data) => {
        try {
            var salesperson = new Salesperson(salesperson_data);
            await salesperson.save();
            return salesperson;
        }
        catch(err) {
            console.log(`Received an error creating salesperson: ${err}`);
        }
    },
    getSalespeopleToEmail: async () => {
        try {
            let salespeople = await Salesperson.find({'get_mail': true});
            return salespeople;
        }
        catch(err) {
            console.log('Received an error getting salespeople to email');
        }
    },
    updateSalesperson: async (criteria, update ) => {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let salesperson = await Salesperson.findOneAndUpdate(criteria, update, {new: true});
            return salesperson;
        }
        catch (err) {
            console.log('Received an error updating salesperson');
        }
    },

    /**
     * List all ports in the database
     *
     */
    listPorts: async () => {
        try {
            let ports = await Port.find();
            return ports;
        }
        catch (err) {
            console.log('Received an error getting ports listing');
        }
    },

    /**
     * Get specific port by id
     *
     */
    getPortById: async (id) => {
        try {
            var port_id = mongoose.Types.ObjectId(id);
            let port = await Port.findById({_id: port_id});
            return port;
        }
        catch (err) {
            console.log('Received an error getting port');
        }
    },
    /**
     * Create port
     *
     */
    createPort: async (port_data) => {
        try {
            var new_port = new Port(port_data);
            await new_port.save();
            return new_port;
        }
        catch(err) {
            console.log('Received an error creating a port');
        }
    },
    /**
     * Update specific port
     *
     */
    updatePort: async (criteria, update ) => {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let port = await Port.findOneAndUpdate(criteria, update, {new: true});
            return port;
        }
        catch (err) {
            console.log('Received an error updating port');
        }
    }
}
