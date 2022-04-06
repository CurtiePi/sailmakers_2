var express = require('express');
var mongoose = require('mongoose');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.options('*', (req, res) => { res.sendStatus(200); });

router.get('/', authenticate.verifyUser, authenticate.verifyAdmin, function(req, res, next) {
    User.find({})
        .then((users) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(users);
        }, (err) => next(err))
        .catch((err) => next(err));
});

router.post('/signup', (req, res, next) => {
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
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            console.log(err);
            return next(err);
        }

        if (!user) {
            console.log("NO USER FOUND!!");
            res.statusCode = 401;
            res.setHeader('Content-Type', 'text/plain');
            res.json({ success: false, status: 'Login unsuccessful!', err: info });
        }

        req.login(user, (err) => {
            if (err) {
                console.log("PROBLEM LOGGIN IN USER!");
                res.statusCode = 401;
                res.setHeader('Content-Type', 'text/plain');
                res.json({ success: false, status: 'Login unsuccessful!', err: 'Could not log in user!' });
            }

            var token = authenticate.getToken({_id: req.user._id});
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.json({success: true, status: 'Your are successfully logged in!', token: token});
        });
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    res.redirect('/');
});

router.get('/checkJWTToken', (req, res) => {
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
module.exports = router;
