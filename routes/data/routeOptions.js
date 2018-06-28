let ctr = require('../../control/middleware.js');

const prefix = '/api/data/';
//prefix + '

const controller = require('./controller.js');

module.exports = function (app, db) {
    app.get(prefix + 'options/', ctr.isLoggedIn, controller.optionsGet);
    app.post(prefix + 'options/', ctr.isLoggedIn, controller.optionsUpsert);


};