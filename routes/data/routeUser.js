let ctr = require('../../control/middleware.js');

const prefix = '/api/data/';


const controller = require('./controller.js');

module.exports = function (app, db) {
    app.get(prefix + 'users/', ctr.isLoggedIn, controller.userCreate);

    app.delete(prefix + 'users/:id', ctr.isLoggedIn, ctr.requireAdmin, controller.userDelete);
};