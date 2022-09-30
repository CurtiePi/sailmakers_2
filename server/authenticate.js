import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import User from './models/user.js';
import jwt from 'jsonwebtoken';
import config from './config/config.js';


const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secretKey,
    ignoreExpiration: false,
    jsaonWebTokenOptions: {
        maxAge: '1w'
    }
}

const localStrategy = new LocalStrategy(User.authenticate());
const jwtStrategy = new JwtStrategy(jwtOptions,
    (jwt_payload, done) => {

        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false);
            }
            else if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        });
    });

passport.use(localStrategy);
passport.use(jwtStrategy);

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const verifyUser = passport.authenticate('jwt', { session: false });

const getToken = (user) => {
    return jwt.sign(user, config.secretKey, { expiresIn: 3600 });
};

const verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    }
    else {
        var err = new Error('Your are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
};

export { verifyUser, verifyAdmin, getToken };
