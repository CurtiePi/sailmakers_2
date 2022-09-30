import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import User from '../models/user.js';
import passport from 'passport';
import { verifyUser, verifyAdmin, getToken } from '../authenticate.js';

const userRouter = express.Router();
userRouter.use(bodyParser.json());

/**
 * @api {get} users
 */
userRouter.options('*', (req, res) => { res.sendStatus(200); });

userRouter.get('/', verifyUser, verifyAdmin, function(req, res, next) {
    User.find({})
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
});

/**
 * @api {post} users
 */
userRouter.post('/signup', (req, res, next) => {
    User.register(new User({username: req.body.username}), req.body.password,(err, user) => {
        if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({err: err});
        }
        passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration Successful!'});
        });
    });
});                                                                                             // Sign up a user.

userRouter.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log(err);
            res.json({ success: false, message: err });
        }

        if (!user) {
            console.log("NO USER FOUND!!");
            res.statusCode = 401;
            res.setHeader('Content-Type', 'text/plain');
            res.json({ success: false, message: 'Login unsuccessful, user not found', err: info });
        } else {
            var token = getToken({ _id: user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, message: 'Your are successfully logged in!', token: token});
        }

        /*
            * RECEIVED ERROR HERE BUT NOT REALLY NEEDED CONSIDER WHETHER TO FIX OR DEPRECATE
        req.login(user, (err) => {
            if (err) {
                console.log("PROBLEM LOGGIN IN USER!");
                res.statusCode = 401;
                res.setHeader('Content-Type', 'text/plain');
                res.json({ success: false, status: 'Login unsuccessful!', err: 'Could not log in user!' });
            }

            console.log('I passed the error with user test!!!!');
            console.log('The req.user._id value!');
            console.log(req.user);
            console.log(req.user._id);
            var token = getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, status: 'Your are successfully logged in!', token: token});
        });
        */

    })(req, res);
});                                                                                             // Log in a user

userRouter.get('/logout', (req, res, next) => {
    res.redirect('/');
});

userRouter.get('/checkJWTToken', (req, res) => {
    passport.authenticate('jwt', { session: false}, (err, user, info) => {
        if (err)
            return next(err);

        if (!user) {
            res.statusCode = 401;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ status: 'JWT invalid!', success: false, err: info});
        }
        else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({ status: 'JWT valid!', success: true, user: user});
        }
    })(req, res);
});

export default userRouter;
