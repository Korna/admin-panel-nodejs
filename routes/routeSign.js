
const passport = require('passport');
module.exports = function(app, db) {
    app.post('/api/signup', passport.authenticate('local-signup', { session: true }), function (req, res, next) {
        res.status(200).end();
    });

    app.post('/api/signin', passport.authenticate('local-login', { session: true }), function (req, res, next) {
            res.status(200).end();
        }
    );
};

/*
const passport = require('passport');
//const express = require('express');
//const router = express.Router();

module.exports = function(app, db) {
    app.post('/api/signup', passport.authenticate('local-signup', function (req, res) {
        res.status(200);
    }));


    app.post('/api/signin', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {

              //  return res.redirect('/login');
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('/users/' + user.username);
            });
        })(req, res, next);
    });

};



//module.exports = router;

 */