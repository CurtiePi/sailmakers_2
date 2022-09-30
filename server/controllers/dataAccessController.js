import mongoose from 'mongoose';
import Customer from '../models/customers.js';
import Salesperson from '../models/salespeople.js';
import Quote from '../models/quotes.js';
import Port from '../models/ports.js';

const dataAccess = class DataAccessController {
    /**
     * List all customers in the database
     *
     */
    async listCustomers () {
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
            console.log(`Received an error getting customer listing:\n${err}`);
        }
    }

    /**
     * Get specific customers by id
     *
     */
    async getCustomerById (id) {
        try {
            var user_id = mongoose.Types.ObjectId(id);
            let customer = await Customer.findById({_id: user_id});
            return customer;
        }
        catch (err) {
            console.log(`Received an error getting customer:\n${err}`);
        }
    }

    async createCustomer (customer_data) {
        try {
            var customer = new Customer(customer_data);
            await customer.save();

            return customer;
        }
        catch(err) {
            console.log(`Received an error creating customer:\n${err}`);
        }
    }

    /**
     * Find specific customers based on criteria
     *
     */
    async findCustomers (criteria) {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let customers = await Customer.find(criteria)
                                          .populate('quotes')
            return customers;
        }
        catch (err) {
            console.log(`Received an error finding customer:\n${err}`);
        }
    }

    /**
     * Update specific customer
     *
     */
    async updateCustomer (criteria, update ) {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let customer = await Customer.findOneAndUpdate(criteria, update, {new: true});
            return customer;
        }
        catch (err) {
            console.log(`Received an error updating customer:\n${err}`);
        }
    }

    /**
     * Delete Customer
     *
     */
    async deleteCustomer (customer) {
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
            console.log(`Received an error deleting customer:\n${err}`);
        }
    }

    async listQuotes () {
        try {
            let quotes = await Quote.find()
                                    .sort({createAt: -1})
                                    .populate({path: 'salesperson', model: 'Salesperson'})
                                    .populate({path: 'customer', model: 'Customer'});
            return quotes;
        }
        catch(err) {
            console.log(`Received an error getting quote listing:\n${err}`);
        }
    }

    async getQuoteById (id) {
        try {
            var quote_id = mongoose.Types.ObjectId(id);
            let quote = await Quote.findById({_id: quote_id})
                                   .populate('salesperson');
            return quote;
        }
        catch(err) {
            console.log(`Received an error getting quote:\n${err}`);
        }
    }

    async getCustomerQuotes (cid) {
        try {
            var customer_id = mongoose.Types.ObjectId(cid);
            let quotes = await Quote.find({customer: customer_id})
                                    .sort({createAt: -1})
                                    .populate('customer')
                                    .populate('salesperson');
            return quotes;
        }
        catch(err) {
            console.log(`Received an error getting customer quotes:\n${err}`);
        }
    }

    async createQuote (quote_data) {
        try {
            // Make sure customer id and salesperson id are Object ids
            var customer_id = mongoose.Types.ObjectId(quote_data.customer_id);
            var salesper_id = mongoose.Types.ObjectId(quote_data.salesperson_id);

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
            console.log(`Received an error creating a quote:\n${err}`);
        }
    }

    async deleteQuote (quote) {
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
            console.log(`Received an error deleting quote:\n${err}`);
        }
    }

    /**
     * Find specific quotes by crtiteria
     *
     */
    async findQuotes (criteria) {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let quotes = await Quote.find(criteria)
                                    .sort({createAt: -1})
                                    .populate('customer')
                                    .populate('salesperson');
            return quotes;
        }
        catch (err) {
            console.log(`Received an error searching quotes ${err}`);
        }
    }

    /**
     * Update specific quote
     *
     */
    async updateQuote (criteria, update ) {
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
            console.log(`Received an error updating quote:\n${err}`);
        }
    }

    async addQuoteDoc (quoteId, filePath ) {
        const criteria = { '_id': mongoose.Types.ObjectId(quoteId) };

        try {
            let quote = await Quote.findByIdAndUpdate(criteria, { $push: { doc_path: filePath} }, {new: true});
            await Quote.populate(quote, { path: "customer" });
            await Quote.populate(quote, { path: "salesperson" });
            return quote;
        }
        catch (err) {
            console.log(`Received an error adding document to quote:\n${err}`);
        }
    }

    async getSalespeople () {
        try {
            let salespeople = await Salesperson.find();
            return salespeople;
        }
        catch(err) {
            console.log(`Received an error getting listing of salespeople:\n${err}`);
        }
    }

    async getSalespersonById (id) {
        try {
            var salesperson_id = mongoose.Types.ObjectId(id);
            let salesperson = await Salesperson.findById({_id: salesperson_id});
            return salesperson;
        }
        catch(err) {
            console.log(`Received an error getting salesperson:\n${err}`);
        }
    }

    async getSalespersonByName (name_param) {
        try {
            var nameArr= name_param.split(' ');
            let salesperson = await Salesperson.find({lname: nameArr[1], fname: nameArr[0]});
            return salesperson;
        }
        catch(err) {
            console.log(`Received an error getting salesperson by name:\n${err}`);
        }
    }

    async createSalesperson (salesperson_data) {
        try {
            var salesperson = new Salesperson(salesperson_data);
            await salesperson.save();
            return salesperson;
        }
        catch(err) {
            console.log(`Received an error creating salesperson: ${err}`);
        }
    }

    async getSalespeopleToEmail () {
        try {
            let salespeople = await Salesperson.find({'get_mail': true});
            return salespeople;
        }
        catch(err) {
            console.log(`Received an error getting salespeople to email:\n${err}`);
        }
    }

    async updateSalesperson (criteria, update ) {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let salesperson = await Salesperson.findOneAndUpdate(criteria, update, {new: true});
            return salesperson;
        }
        catch (err) {
            console.log(`Received an error updating salesperson:\n${err}`);
        }
    }

    /**
     * List all ports in the database
     *
     */
    async listPorts () {
        try {
            let ports = await Port.find();
            return ports;
        }
        catch (err) {
            console.log(`Received an error getting ports listing:\n${err}`);
        }
    }

    /**
     * Get specific port by id
     *
     */
    async getPortById (id) {
        try {
            var port_id = mongoose.Types.ObjectId(id);
            let port = await Port.findById({_id: port_id});
            return port;
        }
        catch (err) {
            console.log(`Received an error getting port:\n${err}`);
        }
    }
    /**
     * Create port
     *
     */
    async createPort (port_data) {
        try {
            var new_port = new Port(port_data);
            await new_port.save();
            return new_port;
        }
        catch(err) {
            console.log(`Received an error creating a port:\n${err}`);
        }
    }
    /**
     * Update specific port
     *
     */
    async updatePort (criteria, update ) {
        if (criteria._id) {
            criteria._id = mongoose.Types.ObjectId(criteria._id);
        }

        try {
            let port = await Port.findOneAndUpdate(criteria, update, {new: true});
            return port;
        }
        catch (err) {
            console.log(`Received an error updating port:\n${err}`);
        }
    }
};

export default new dataAccess();
