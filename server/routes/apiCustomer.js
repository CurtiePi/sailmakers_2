const express               = require('express');
const routeController       = require('../controllers/routingController');
const apiCustomerRouter     = express.Router();
const bucketmaster          = require('../middleware/s3Interface.js');

module.exports  = apiCustomerRouter;

/*
 * Customer routes
 */

/**
 * @api {get} /list customers
 *
 */
apiCustomerRouter.get('/', routeController.getCustomerList);
apiCustomerRouter.get('/:id', routeController.getCustomerById);

apiCustomerRouter.post('/search', routeController.findCustomers);
apiCustomerRouter.post('/update', routeController.updateCustomer);
apiCustomerRouter.post('/create', routeController.createCustomer);
apiCustomerRouter.post('/delete', routeController.deleteCustomer, bucketmaster.removeFromS3, (req, res, next) => {
    res.status(200).json({message: 'ok'});
});

