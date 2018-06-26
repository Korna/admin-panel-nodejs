
const passport = require('passport');
const controller = require('./controller.js');
const tfa = require('./tfa.js');
let ctr = require('../../control/middleware.js');

const prefix = '/api/auth/';

module.exports = function(app, db) {
    app.post(prefix + 'signup', passport.authenticate('local-signup', { session: true }), controller.signup);

    app.post(prefix + 'signin', passport.authenticate('local-login', { session: true }), controller.signin);

    app.post(prefix + 'tfa/create', ctr.isLoggedIn, tfa.create);
    app.post(prefix + 'tfa/active', ctr.isLoggedIn, tfa.active);
    app.post(prefix + 'tfa/check', tfa.check);
    app.post(prefix + 'tfa/delete', ctr.isLoggedIn, tfa.delete);
    app.post(prefix + 'tfa/signin', tfa.signin);


};

