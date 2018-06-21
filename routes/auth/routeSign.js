
const passport = require('passport');
const controller = require('./controller.js');

const prefix = '/api/auth/';

module.exports = function(app, db) {
    app.post(prefix + 'signup', passport.authenticate('local-signup', { session: true }), controller.signup);

    app.post(prefix + 'signin', passport.authenticate('local-login', { session: true }), controller.signin);
};

