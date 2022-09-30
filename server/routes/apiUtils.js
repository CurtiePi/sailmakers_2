import express from 'express';
import { getDashboardRawData, uploadFile } from '../controllers/routingController.js';
import { downloadFromS3, uploadToS3 } from '../middleware/s3Interface.js';
import { marshalDashboardData } from '../middleware/dashboard.js';

const utilsRouter = express.Router();

/*
 * Utility routes
 */

/**
 * @api {get} utilities
 */
utilsRouter.get('/download/:filename', downloadFromS3);         // Get document from Amazon S3
    
utilsRouter.get('/dashboard', getDashboardRawData, marshalDashboardData, (req, res, next) => {
    res.status(200).json({ 'msg': 'You have the power', 'data': req.marshalledData });
});                                                             // Get data to poopulate Dashboard

/**
 * @api {post} utilities
 */
utilsRouter.post('/upload', uploadToS3, uploadFile);            // Send documnent to Amazon S3

export default utilsRouter;
