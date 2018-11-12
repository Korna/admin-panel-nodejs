const passport = require('passport');
const controller = require('./controller.js');
const tfa = require('./tfa.js');
const google = require('./google.js');
const ctr = require('../../control/middleware.js');

const prefix = '/api/auth/';

module.exports = function (app, db) {
    app.post(prefix + 'signup', passport.authenticate('local-signup', {session: true}), controller.signup);
    app.post(prefix + 'signin', passport.authenticate('local-login', {session: true}), controller.signin);

    app.get('/logout', ctr.isLoggedIn, controller.logout);


    //app.post(prefix + 'google/auth', passport.authenticate('google', {scope: ['profile']}), google.token);
    //app.post(prefix + 'google/callback', controller.googleauth);

    app.post(prefix + 'google/auth',
        google.token,
        // google.handleToken(passport),
        // passport.authenticate('local-passwordless'),
        passport.authenticate('local-login', {session: true}),
        controller.signin);

    app.post(prefix + '/auth/google/token',
        google.token,
        google.handleToken(passport),
        passport.authenticate('local-passwordless'),
        controller.signin
    );


    app.post(prefix + 'tfa/create', ctr.isLoggedIn, tfa.create);
    app.post(prefix + 'tfa/active', ctr.isLoggedIn, tfa.active);
    app.post(prefix + 'tfa/check', tfa.check);
    app.post(prefix + 'tfa/delete', ctr.isLoggedIn, tfa.delete);
    app.post(prefix + 'tfa/signin', tfa.signin);

};

