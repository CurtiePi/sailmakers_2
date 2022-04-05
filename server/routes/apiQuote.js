const express           = require('express');
const routeController   = require('../controllers/routingController');
const multer            = require('multer');
const printpress        = require('../middleware/guttenburg.js');
const lycanthrope       = require('../middleware/modifier.js');
const apiQuoteRouter    = express.Router();

const upload = multer({
    dest: './public/files/uploads',
});

module.exports  = apiQuoteRouter;

/*
 * Quote routes
 */

/**
 * @api {get} /list quotes 
 *
 */
apiQuoteRouter.get('/', routeController.getQuoteList);
apiQuoteRouter.get('/:id', routeController.getQuoteById);
apiQuoteRouter.get('/customer/:cid', routeController.getQuotesByCustomer);

apiQuoteRouter.post('/create', routeController.createQuote);
apiQuoteRouter.post('/update', routeController.updateQuote);
apiQuoteRouter.post('/delete', routeController.deleteQuote, printpress.removeQuoteDoc, (req, res, next) => {
    res.status(200).json({message: 'ok'});
});
apiQuoteRouter.post('/print', printpress.writeQuoteDoc, routeController.addQuoteDoc);
apiQuoteRouter.post('/modify', lycanthrope.modifyQuote, (req, res, next) => {
    var totalPrice = req.totalprice;
    res.status(200).json({message: 'Quote has been modified.', quote_price: totalPrice});
});
apiQuoteRouter.post('/price', upload.single('file'),  lycanthrope.modifyQuote, (req, res, next) => {
    var totalPrice = req.totalprice;
    res.status(200).json({message: 'File has been uploaded.', quote_price: totalPrice});
});
apiQuoteRouter.post('/removePdf', printpress.removeQuoteDoc, routeController.updateQuote);

