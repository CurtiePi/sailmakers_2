const express               = require('express');
const marshaller            = require('../middleware/dashboard.js');
const s3                    = require('../middleware/s3Interface.js');
const routeController       = require('../controllers/routingController');
const apiUtilsRouter        = express.Router();

module.exports  = apiUtilsRouter;

/*
 * Utility routes
 */
apiUtilsRouter.post('/upload', s3.uploadToS3, routeController.uploadFile);

apiUtilsRouter.get('/download/:filename', s3.downloadFromS3);
    
apiUtilsRouter.get('/dashboard', routeController.getDashboardRawData, marshaller.marshalDashboardData, (req, res, next) => {
    res.status(200).json({ 'msg': 'You have the power', 'data': req.marshalledData });
});

