import express from 'express';
import { findCustomers, createCustomer, deleteCustomer, updateCustomer, getCustomerList, getCustomerById } from '../controllers/routingController.js';
import { removeFromS3 } from '../middleware/s3Interface.js';

const customerRouter = express.Router();

/*
 * Customer routes
 */

/**
 * @api {get} customers
 */
customerRouter.get('/', getCustomerList);           // Get list of all customers
customerRouter.get('/:id', getCustomerById);        // Get a customer by Id

/**
 * @api {post} customers
 */
customerRouter.post('/search', findCustomers);      // Find customers based on criteria
customerRouter.post('/update', updateCustomer);     // Update customer information
customerRouter.post('/create', createCustomer);     // Create a customer
customerRouter.post('/delete', deleteCustomer, removeFromS3, (req, res, next) => {
    res.status(200).json({message: 'ok'});
});                                                 // Remove a customer

export default customerRouter;
