import express from 'express';
import { getPortsList, getPortById, createPort, updatePort } from '../controllers/routingController.js';
const portRouter = express.Router();

portRouter.get('/', getPortsList);
portRouter.get('/:pid', getPortById);
portRouter.post('/create', createPort);
portRouter.post('/update/:pid', updatePort);

export default portRouter;
