const passport = require('passport');
//const express = require('express');
//const router = express.Router();

module.exports = function(app, db) {
    app.post('/api/signup', passport.authenticate('local-signup'), function (req, res, next) {
        res.status(200);//.end();
    });

    app.post('/api/signin', passport.authenticate('local-login'), function (req, res, next) {
            res.status(200);//.end();
        }
    );

};



//module.exports = router;
