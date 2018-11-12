let ctr = require('../../control/middleware.js');

const prefix = '/api/data/';

const controller = require('./controller.js');

module.exports = function (app, db) {
    app.get(prefix + 'profile/', ctr.isLoggedIn, controller.profileGet);
    app.post(prefix + 'profile/updateFcm', ctr.isLoggedIn, controller.fcmUpsert);
    app.post(prefix + 'profile/', ctr.isLoggedIn, controller.profileUpsert);
};