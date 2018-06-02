
const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');
let Message = require('../models/message.js');
let DialogMember = require('../models/dialogMember.js');
let User = require('../models/user.js');

let fcm = require('../control/fcm.js');


module.exports = function(app, db) {

    app.post('/api/chat/message/get', ctr.isLoggedIn, //get messages from dialog
        function(req, res) {
            const dialogId = req.body.dialogId;

            const query = {'dialogId': dialogId};

            Message.find(query)
                .exec((err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    const reversed = item.reverse();
                    res.send(reversed);
                }
            });
        });

    app.post('/api/chat/message/', ctr.isLoggedIn,
        function(req, res) {
           // console.log(req.body);
            const dialogId = req.body.dialogId;
            const text = req.body.text;
            const senderId = req.user.id;
            const message = new Message();
            message.dialogId = dialogId;
            message.senderId = senderId;
            message.text = text;
            message.timeSent = Date.now();
         //   console.log('userId' + req.user.id);

            message.save((err, result) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                 //   console.log(result);
                    res.send(result);

                    const query = {'dialogId': dialogId};

                    DialogMember.find(query)//.populate('memberId')
                        .exec((err, dialogs) => {
                        if (err) {
                            res.send({'error': 'An error has occurred'});
                        } else {

                            let idList = [];
                            dialogs.forEach(function (item) {
                                idList.push(item.memberId);

                            });
                            User.find({'_id': {$in: idList}})
                                .populate('optionsId')
                                .exec((err, users) => {
                                users.forEach(function (user) {
                                    let token = user.fcmToken;

                                    let receiverId = user.id;
                                    if(user.optionsId == null || user.optionsId.receiveFcm == true)
                                        if(senderId !== receiverId)
                                            fcm.sendToDevice(token, 'New message', text);

                                    console.log(user);
                                })


                            });

                        }
                    });

                }
            });
        });

};