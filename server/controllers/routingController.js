const dataAccess        = require('./dataAccessController');

module.exports = {
    /*
     * Customers
     *
     */
    getCustomerList: async (req, res, next) => {
        try {
            var customers = await dataAccess.listCustomers();
            res.status(200).json(customers);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving customer list ${err}` 
            })
        }
    },
    getCustomerById: async (req, res, next) => {
        try {
            var customer = await dataAccess.getCustomerById(req.params.id);
            res.status(200).json(customer);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving customer ${err}` 
            });
        }
    },
    findCustomers: async (req, res, next) => {
        try {
            var customers = await dataAccess.findCustomers(req.body.criteria);
            res.status(200).json(customers);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error searching for customers ${err}` 
            });
        }
    },
    createCustomer: async (req, res, next) => {
        try{
            var customer = await dataAccess.createCustomer(req.body);
            res.status(200).json(customer);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error creating customer ${err}`
            });
        }
    },
    updateCustomer: async (req, res, next) => {
        try {
            var customer = await dataAccess.updateCustomer(req.body.criteria, req.body.update);
            res.status(200).json(customer);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error updating customer ${err}` 
            });
        }
    },
    deleteCustomer: async (req, res, next) => {
        try{
            req.pdf_list = await dataAccess.deleteCustomer(req.body.customer);
            next();
        }
        catch(err) {
            return res.status(500).json({
                message: `Error deleting customer ${err}`
            });
        }
    },
    /*
     * Quotes
     *
     */
    getQuoteList: async (req, res, next) => {
        try {
            var quotes = await dataAccess.listQuotes();
            res.status(200).json(quotes);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving quotes list ${err}` 
            });
        }
    },
    getQuoteById: async (req, res, next) => {
        try {
            var quote = await dataAccess.getQuoteById(req.params.id);
            res.status(200).json(quote);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving quote ${err}` 
            });
        }
    },
    getQuotesByCustomer: async (req, res, next) => {
        try{
            var quotes = await dataAccess.getCustomerQuotes(req.params.cid);
            res.status(200).json(quotes);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving quote ${err}`
            });
        }
    },
    createQuote: async (req, res, next) => {
        try{
            // console.log(req.body.quoteObj)
            var quote = await dataAccess.createQuote(req.body.quoteObj);
            if (req.body.customerObj) {
                var criteria = req.body.customerObj.criteria;
                var data = req.body.customerObj.data;
                var customer = await dataAccess.updateCustomer(criteria, data); 
            }
            res.status(200).json(quote);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error creating quote ${err}`
            });
        }
    },
    findQuotes: async (req, res, next) => {
        try{
            var quotes = await dataAccess.findQuotes(req.body.criteria);
            res.status(200).json(quotes);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error searching quotes ${err}`
            });
        }
    },
    updateQuote: async (req, res, next) => {
        try{
            var quote = await dataAccess.updateQuote(req.body.criteria, req.body.update);
            res.status(200).json(quote);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error updating quote ${err}`
            });
        }
    },
    deleteQuote: async (req, res, next) => {
        try{
            req.pdf_list = await dataAccess.deleteQuote(req.body.quote);

            next();
        }
        catch(err) {
            return res.status(500).json({
                message: `Error deleting quote ${err}`
            });
        }
    },
    addQuoteDoc: async (req, res, next) => {
        var filename = req.pdf_filename;
        var quote = req.body.payload;

        try{
            var quote = await dataAccess.addQuoteDoc(quote._id, filename);
            res.status(200).json(quote);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error updating quote ${err}`
            });
        }
    },
    uploadFile: async (req, res, next) => {
        var quote_id = req.body.quote_id;
        var filename = req.body.pdf_filename;

        try{
            var quote = await dataAccess.addQuoteDoc(quote_id, filename);
            res.status(200).json(quote);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error updating quote ${err}`
            });
        }
    },
    /*
     * Salespeople
     *
     */
    getSalespeople: async (req, res, next) => {
        try {
            var salespeople = await dataAccess.getSalespeople();
            res.status(200).json(salespeople);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving salespeople list  ${err}` 
            });
        }
    },
    getSalespersonById: async (req, res, next) => {
        try {
            var salesperson = await dataAccess.getSalespersonById(req.params.sid);
            res.status(200).json(salesperson);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving salesperson  ${err}` 
            });
        }
    },
    createSalesperson: async (req, res, next) => {
        try {
            var salesperson = await dataAccess.createSalesperson(req.body);
            res.status(200).json(salesperson);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error creating salesperson  ${err}` 
            });
        }
    },
    getSalespersonByName: async (req, res, next) => {
        try {
            var salesperson = await dataAccess.getSalespersonByName(req.params.name);
            res.status(200).json(salesperson);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving salesperson ${err}` 
            });
        }
    },
    getSalespeopleToEmail: async (req, res, next) => {
        try {
            var salespeople = await dataAccess.getSalespeopleToEmail();
            res.status(200).json(salespeople);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving salesperson email recipients ${err}` 
            });
        }
    },
    updateSalesperson: async (req, res, next) => {
        try{
            var salesperson = await dataAccess.updateSalesperson(req.body.criteria, req.body.update);
            res.status(200).json(salesperson);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error updating salesperson ${err}`
            });
        }
    },
    /*
     * Ports
     *
     */
    getPortsList: async (req, res, next) => {
        try {
            var ports = await dataAccess.listPorts();
            res.status(200).json(ports);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving ports list ${err}` 
            })
        }
    },
    getPortById: async (req, res, next) => {
        try {
            var port = await dataAccess.getPortById(req.params.pid);
            res.status(200).json(port);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error retrieving port ${err}` 
            });
        }
    },
    createPort: async (req, res, next) => {
        try {
            var port = await dataAccess.createPort(req.body);
            res.status(200).json(port);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error creating port  ${err}` 
            });
        }
    },
    updatePort: async (req, res, next) => {
        try {
            var port = await dataAccess.updatePort(req.body.criteria, req.body.update);
            res.status(200).json(port);
        }
        catch(err) {
            return res.status(500).json({
                message: `Error updating port ${err}` 
            });
        }
    },

    getDashboardRawData: async (req, res, next) => {
        try {
            var customers = await dataAccess.listCustomers();
            var quotes = await dataAccess.listQuotes();
            let rawData = {'quoteData': quotes, 'customerData': customers};
            req.dashboardRawData = rawData;
            next();
        }
        catch(err) {
            return res.status(500).json({
                message: `Error getting dashboard raw data ${err}` 
            });
        }
    }
}
