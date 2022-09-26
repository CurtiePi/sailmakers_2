const express               = require('express');
const mailman               = require('../middleware/mailman.js');
const routeController       = require('../controllers/routingController');
const apiEmailRouter        = express.Router();


module.exports  = apiEmailRouter;

/*
 * Email routes
 */

apiEmailRouter.post('/', mailman.deliverEmail, (req, res, next) => {
  res.status(200).json({'message': req.message});
});

/*
apiEmailRouter.post('/', (req, res, next) => {
  console.log(req.channel);
  res.status(200).json({'message': `the channel is ${req.channel}`});
});
*/
