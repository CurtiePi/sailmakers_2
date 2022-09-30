import express from 'express';
import deliverEmail from '../middleware/mailman.js';

const emailRouter = express.Router();


/*
 * Email routes
 */

/**
 * @api {post} email
 */
emailRouter.post('/', deliverEmail, (req, res, next) => {
  res.status(200).json({'message': req.message});
});                                                 // Send an email

export default emailRouter;
