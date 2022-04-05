const express           = require('express');
const routeController   = require('../controllers/routingController');
const apiStaffRouter    = express.Router();

module.exports = apiStaffRouter;

/*
 * Salespeople routes
 */
apiStaffRouter.get('/', routeController.getSalespeople);
apiStaffRouter.get('/emaillist', routeController.getSalespeopleToEmail);
apiStaffRouter.get('/:id', routeController.getSalespersonById);
apiStaffRouter.get('/name/:name', routeController.getSalespersonByName);


apiStaffRouter.post('/create', routeController.createSalesperson);
apiStaffRouter.post('/update', routeController.updateSalesperson);


