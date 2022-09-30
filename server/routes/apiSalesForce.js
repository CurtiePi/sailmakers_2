import express from 'express';
import { createSalesperson, updateSalesperson, getSalespeople, getSalespeopleToEmail, getSalespersonById, getSalespersonByName } from '../controllers/routingController.js';

const staffRouter = express.Router();

/*
 * Salespeople routes
 */

/**
 * @api {get} salespeople
 */
staffRouter.get('/', getSalespeople);                   // Get a list of salespeople
staffRouter.get('/emaillist', getSalespeopleToEmail);   // Get lisst of salespeople to email
staffRouter.get('/:id', getSalespersonById);            // Get a salesperson by id
staffRouter.get('/name/:name', getSalespersonByName);   // Get a salesperson by name

/**
 * @api {post} salespeople 
 */
staffRouter.post('/create', createSalesperson);         // Create a salesperson
staffRouter.post('/update', updateSalesperson);         // Update a salesperson

export default staffRouter;
