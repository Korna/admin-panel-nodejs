const ObjectID = require('mongodb').ObjectID;
let ctr = require('../../control/middleware.js');

let Message = require('../../models/message.js');
let Dialog = require('../../models/dialog.js');
let ChatMember = require('../../models/dialogMember.js');


module.exports.signup = function (req, res, next) {
    res.status(200).end();
};

module.exports.signin = function (req, res, next) {
    res.status(200).end();
};