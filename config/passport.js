const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.js');
const ObjectID = require('mongodb').ObjectID;
const TwoFAStartegy = require('passport-2fa-totp').Strategy;
const GoogleAuthenticator = require('passport-2fa-totp').GoogeAuthenticator;

const CustomStrategy = require('passport-custom').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


module.exports = function (passport) {

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function (req, email, password, done) {
            process.nextTick(function () {
                User.findOne({'email': email}, function (err, user) {
                    if (err)
                        return done(err);

                    if (user)
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    else {
                        let newUser = new User();
                        let id = new ObjectID();

                        newUser._id = id;
                        newUser.email = email;
                        newUser.password = newUser.generateHash(password);
                        newUser.optionsId = id;
                        newUser.profileId = id;

                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });

                    }
                });
            });
        }));

    passport.use('local-login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        function (req, email, password, done) {
            User.findOne({'email': email}, function (err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, {message: 'No user.'});
                if (!user.validPassword(password))
                    return done(null, false, {message: 'Incorrect password.'});

                if (user.tfaOn === true)
                    return done(null, false, {message: '2fa code required.'});

                return done(null, user);
            });
        }));

    passport.use('tfa-user', new TwoFAStartegy({
        usernameField: 'email',
        passwordField: 'password',
        codeField: 'code',
    }, (email, password, done) => {
        User.findOne({'email': email}).catch(error =>
            done(error)).then((user) => {
            if (!user) {
                let message = 'incorrect login';
                console.log(message);

                return done(null, false, {
                    message: message,
                });
            } else if (user.validPassword(password)//((user.password === cryptography.hash(password, user.salt))
                // && (user.block !== true)
                && (user.tfaOn === true)) {
                let message = '2fa enabled and pass is valid';
                console.log(message);
                return done(null, user);//{ user, type: 'user' });
            }

            console.log('incorrect login');
            return done(null, false, {
                message: 'incorrect login',
            });
        });
    }, (user, done) => {
        if (user.secretTfa) {
            console.log('decoding');
            const secret = GoogleAuthenticator.decodeSecret(user.secretTfa);
            done(null, secret, 30);
        } else
            done(new Error('Google Authenticator is not setup yet.'));

    }));


    /*
        passport.use(
            'local-passwordless',
            new LocalStrategy({// by default, local strategy uses username and password, we will override with email
                    usernameField: 'email',
                    passwordField: 'email',
                    passReqToCallback: true // allows us to pass back the entire request to the callback
                },
                function(req, email, password, done) {
                    console.log('loggg');
                    User.findOne({ 'email':  email }, function(err, user) {
                        if (err)
                            return done(err, false, err);
                        if (user) {
                            return done(null, user);
                        }

                        return done(null, false, err);
                    });


                }
            )
        );


        passport.use(//TODO sads
            'token', new CustomStrategy(function(req, cb) {
                db.query(
                    'SELECT id, first_name, email, last_name FROM app_users WHERE id=$1',
                    [req.body.tokenized],
                    (err, userData) => {
                        if (err) {
                            return cb(err);
                        }

                        if (!userData.rows[0]) {
                            return cb({ error: 'No user after token' });
                        }

                        req.body.email = userData.rows[0].email;
                        return cb(null, userData.rows[0]);
                    }
                );
            })
        );

        passport.use(new GoogleStrategy({// worthless strategy for web
                clientID: '501593929464-und7gbcciv6259n7cc08ums16j0jd99r.apps.googleusercontent.com',
                clientSecret: '-nzLn-3j0CR_nsW2m48iDJOP',
              //  callbackURL: 'https://app-node-pps.herokuapp.com/api/auth/google/callback'
                callbackURL: 'https://127.0.0.1:3000/api/auth/google/callback'
            }, (token, refreshToken, profile, done) => {

                User.findOne({ 'email':  profile.email }, function(err, user) {
                    if (err)
                        return done(err);
                    if (!user)
                        return done(null, false, { message: 'No user.' });
                    else
                        return done(null, user);
                });

            console.log(profile);

                return done(null, {
                    profile: profile,
                    token: token
                });
            }));
    */

};
