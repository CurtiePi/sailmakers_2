/*
 * Set up the dependencies to power this app
 */

import express from 'express';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import config from './config/config.js';
import passport from 'passport';
import cron from 'node-cron';
global.Blob             = function() {};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

console.log(`Database: ${conn_str}`)

var smapp = express();
smapp.use(cors({credentials: true, origin: `http://${config.app.host}:8080`}));
smapp.use(cookieParser());

smapp.use(bodyParser.json({limit: '50mb'}));
smapp.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
smapp.use(express.json({limit: '50mb'}));
smapp.use(passport.initialize());

if (config.environment === 'production') {
    smapp.use(express.static(__dirname + './client/dist'));
}
smapp.use('images', express.static(__dirname + 'public/images'));
smapp.use('/pdf', express.static('public/files/pdf'))
smapp.disable('x-powered-by');
/*
 * Set up routing here
*/
import customerRouter from './routes/apiCustomer.js';
import salespersonRouter from './routes/apiSalesForce.js';
import quoteRouter from './routes/apiQuote.js';
import portRouter from './routes/apiPort.js';
import utilsRouter from './routes/apiUtils.js';
import emailRouter from './routes/apiEmail.js';
import usersRouter from  './routes/users.js';

smapp.use('/user', usersRouter);
smapp.use('/api/customer', customerRouter);
smapp.use('/api/staff', salespersonRouter);
smapp.use('/api/quote', quoteRouter);
smapp.use('/api/port', portRouter);
smapp.use('/api/utils', utilsRouter);

smapp.use('/api/email', emailRouter);


// Set up the cron job
const task_1 = cron.schedule('0 1 */14 * *', async () =>  {
    console.log("Running cronjob.....");
    let result = await cleaner.getPDFKillList();
    if (result.length > 0 ) {
        cleaner.removeQuoteDoc(result);
        cleaner.removeQuoteEntry(result);
    } else {
        console.log("No files to delete! Another time highlander!");
    }
});

task_1.stop();
task_1.start();

if (config.environment === 'production') {
    smapp.use('/', express.static(__dirname + './client/index.html'));
}

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


export default smapp;
