/*
 * Set up the dependencies to power this app
 */

const express           = require('express');
const fs                = require('fs');
const path              = require('path');
const http              = require('http');
const cors              = require('cors');
const bodyParser        = require('body-parser');
const cookieParser      = require('cookie-parser');
const mongoose          = require('mongoose');
// const amqpConnection    = require('amqplib');
const config            = require('./config/config');
const passport          = require('passport');
global.Blob             = function() {};

//require('./lib/strategies')(passport)

let db_host = config.db.host;
let db_port = config.db.port;
let db_name = config.db.name;

let conn_str = `mongodb://${db_host}:${db_port}/${db_name}`;

/*
 * Connection Options Explained
 * useNewUrlParser: allow users to fall back to the old parser if they find a bug in the new parser
 * useUnifiedTopology: server discover and monitor engine
 * useCreateIndex: help Mongoose's default index build avoid deprecation warnings
 * keepAlive: to avoid connection closed errors
 */

mongoose.connect(conn_str, {useNewUrlParser: true,
                               useUnifiedTopology: true,
                               useCreateIndex: true,
                               useFindAndModify: false,
                               keepAlive: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

/* 
 * Get a connection to RabbitMQ for the whole application
 *

let channel = null;
amqpConnection.connect('amqp://localhost')
              .then(conn => conn.createChannel())
              .then(ch => {
                  channel = ch;
              });
*/

console.log(`Database: ${conn_str}`)

var smapp = express();
smapp.use(cors({credentials: true, origin: 'http://192.168.1.4:8080'}));
smapp.use(cookieParser());

smapp.use(bodyParser.json());
smapp.use(bodyParser.urlencoded({ extended: true }));
smapp.use(passport.initialize());
// **** UNCOMMENT NEXT LINE **** //
// smapp.use(express.static(path.join(__dirname, './client/dist')));
smapp.use('images', express.static(path.join(__dirname, 'public/images')));
smapp.use('/pdf', express.static('public/files/pdf'))
smapp.disable('x-powered-by');
/*
 * Set up routing here
 */
customerRouter = require('./routes/apiCustomer');
salespersonRouter = require('./routes/apiSalesForce');
quoteRouter = require('./routes/apiQuote');
portRouter = require('./routes/apiPort');
utilsRouter = require('./routes/apiUtils');
emailRouter = require('./routes/apiEmail');
usersRouter = require('./routes/users');

smapp.use('/user', usersRouter);
smapp.use('/api/customer', customerRouter);
smapp.use('/api/staff', salespersonRouter);
smapp.use('/api/quote', quoteRouter);
smapp.use('/api/port', portRouter);
smapp.use('/api/utils', utilsRouter);
smapp.use('/api/email', emailRouter);
/*
 * Include the RabbitMQ channel in requests to send an email
 *

smapp.use('/api/email',(req, res, next) => {
    req.channel = channel;
    next();
    }, emailRouter);
*/
// **** UNCOMMENT NEXT LINE **** //
// smapp.use('/', express.static(path.join(__dirname, './client/index.html')));

smapp.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var httpServer = http.createServer(smapp);

/*
 * Assign port to the app
 */
let app_port = config.app.port;
let sec_app_port = config.app.sec_port;
httpServer.listen(app_port);
console.log(`HTTP server is  listening on port ${app_port}`)


module.exports = smapp;
