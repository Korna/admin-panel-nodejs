let ctr = require('../../control/middleware.js');

const prefix = '/api/chat/';
//prefix + '
const controller = require('./controller.js');


module.exports = function (app, db) {
    //get messages from dialog
    app.post(prefix + 'message/list', ctr.isLoggedIn, controller.messageList);

    app.post(prefix + 'message/send', ctr.isLoggedIn, controller.messageSend);

};