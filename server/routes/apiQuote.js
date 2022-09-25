const express           = require('express');
const routeController   = require('../controllers/routingController');
const multer            = require('multer');
const printpress        = require('../middleware/guttenburg.js');
const bucketmaster      = require('../middleware/s3Interface.js');
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

apiQuoteRouter.post('/search', routeController.findQuotes);
apiQuoteRouter.post('/create', routeController.createQuote);
apiQuoteRouter.post('/update', routeController.updateQuote);
apiQuoteRouter.post('/delete', routeController.deleteQuote, printpress.removeQuoteDoc, (req, res, next) => {
    res.status(200).json({message: 'ok'});
});

apiQuoteRouter.post('/print', printpress.writeQuoteDoc, bucketmaster.saveToS3, routeController.addQuoteDoc);

apiQuoteRouter.get('/viewPdf/:filename', bucketmaster.getFromS3, (req, res, next) => {
    res.send(req.pdf_base64);
});

apiQuoteRouter.post('/removePdf', printpress.removeQuoteDoc, routeController.updateQuote);

