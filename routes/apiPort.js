const express           = require('express');
const routeController   = require('../controllers/routingController');
const apiPortRouter     = express.Router();

module.exports = apiPortRouter;

apiPortRouter.get('/', routeController.getPortsList);
apiPortRouter.get('/:pid', routeController.getPortById);
apiPortRouter.post('/create', routeController.createPort);
apiPortRouter.post('/update/:pid', routeController.updatePort);
