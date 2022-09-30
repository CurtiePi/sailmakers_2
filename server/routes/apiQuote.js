import express from 'express';
import { findQuotes, createQuote, updateQuote, deleteQuote } from '../controllers/routingController.js';
import { getQuoteList, getQuoteById, getQuotesByCustomer, addQuoteDoc } from '../controllers/routingController.js';
import { saveToS3, getFromS3, removeFromS3 } from '../middleware/s3Interface.js';
import { writeQuoteDoc } from '../middleware/guttenburg.js';

const quoteRouter = express.Router();

/*
 * Quote routes
 */

/**
 * @api {get} quotes 
 */
quoteRouter.get('/', getQuoteList);                         // List all quotes
quoteRouter.get('/:id', getQuoteById);                      // Get quotes by id
quoteRouter.get('/customer/:cid', getQuotesByCustomer);     // Get quotes by customer id

/**
 * @api {post} quotes 
 */
quoteRouter.post('/search', findQuotes);                    // Find quotes based on criteria
quoteRouter.post('/create', createQuote);                   // Create a quote
quoteRouter.post('/update', updateQuote);                   // Update a quote
quoteRouter.post('/delete', deleteQuote, removeFromS3, (req, res, next) => {
    res.status(200).json({message: 'ok'});
});                                                         // Delete a quote
quoteRouter.post('/print', writeQuoteDoc, saveToS3, addQuoteDoc);       // Add a document to a quote

quoteRouter.get('/viewPdf/:filename', getFromS3, (req, res, next) => {
    res.send(req.pdf_base64);
});                                                                     // View a quote's document

quoteRouter.post('/removePdf', removeFromS3, updateQuote);              // Remove a document from a quote

export default quoteRouter;
