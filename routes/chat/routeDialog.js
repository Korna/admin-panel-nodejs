let ctr = require('../../control/middleware.js');


const prefix = '/api/chat/';
//prefix + '
const controller = require('./controller.js');


module.exports = function (app, db) {
    app.get(prefix + 'dialogs/list/', ctr.isLoggedIn, controller.dialogList);
    app.post(prefix + 'dialogs/create/', ctr.isLoggedIn, ctr.checkIfItself, controller.dialogCreate);
};