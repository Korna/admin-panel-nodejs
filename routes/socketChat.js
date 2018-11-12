const THREAD_MESSAGE = 'message';
const THREAD_TYPING = 'event_typing';

/*
let redis = require("redis");
//const port = 6379;
//const host = '127.0.0.1';
let redisClient = redis.createClient();//(port, host);

redisClient.on('connect', function() {
    console.log('Connected to Redis');
});
redisClient.on('error', function(err){
    console.log(err);
});
*/

let Message = require('../models/message.js');
let Dialog = require('../models/dialog.js');
let ChatMember = require('../models/dialogMember.js');
let DialogMember = require('../models/dialogMember.js');
let User = require('../models/user.js');

let fcm = require('../control/fcm.js');

/**
 * отправка в null thread вызывает ошибки у клиентов
 * @param io
 */
module.exports = function (io) {

    io.sockets.on('connection', function(client){
        let userName;
        console.log("user connected!");
        client.emit(THREAD_MESSAGE, 'please insert username');

        /**
         * обработка событий сообщений
         */

        client.on(THREAD_MESSAGE, function(message){

            let messageObject = JSON.parse(message);

            let dialogId = messageObject.dialogId;
            let text = messageObject.text;
            let senderId = messageObject.senderId;
            if(dialogId != null){
                console.log('message received on topic. dialogId is ' + dialogId);
                //client.emit(dialogId, message);
                //client.broadcast.emit(dialogId, message);

                sendAnswer(client, dialogId, text, senderId);
            }else{
                console.log('on thread:' + THREAD_MESSAGE + ' ' + 'dialogId is null')
            }


        });
        /**
         * обработка событий печатания текста
         */
        client.on(THREAD_TYPING, function(status){
            console.log(userName + ' is typing');
           // client.emit(THREAD_TYPING, 'You are typing');

            let messageObject = JSON.parse(status);
            if(messageObject === true ||
                messageObject === false)
                client.broadcast.emit(THREAD_TYPING, status);// to all except sender
            else
                console.log('incorrect message on ' + THREAD_TYPING)

           // client.broadcast.emit(THREAD_TYPING, true);


        });
        /**
         * обработка отключения от сокета
         */
        client.on('disconnect', function() {
            if (userName) {
                console.log(userName + " left");
                client.broadcast.emit(THREAD_MESSAGE, userName + ' left');
            }
            else
                console.log("anonymous left");
        });

    });


    function sendAnswer(client, dialogId, text, senderId) {
        const message = new Message();
        message.dialogId = dialogId;
        message.senderId = senderId;
       // message.text = text;
        message.timeSent = Date.now();
        //   console.log('userId' + req.user.id);

        message.save((err, result) => {
            if (err) {
              //  res.send({'error': 'An error has occurred'});
            } else {
                //   console.log(result);
               // res.send(result);

                client.emit(dialogId, result);//to sender
                client.broadcast.emit(dialogId, result);// to all except sender


                const query = {'dialogId': dialogId};
                sendFcmToAllParticipants(query, senderId)
            }
        });
    }

    function sendFcmToAllParticipants(query, senderId) {

        //найти всех участников диалога
        DialogMember.find(query)//.populate('memberId')
            .exec((err, dialogs) => {
                if (err) {
                    res.send({'error': 'An error has occurred'});
                } else {

                    let idList = [];//массив участников
                    dialogs.forEach(function (item) {
                        idList.push(item.memberId);

                    });
                    //по id находим участника и проверяем, отправлять ли ему пуши
                    User.find({'_id': {$in: idList}})
                        .populate('optionsId')
                        .exec((err, users) => {
                            users.forEach(function (user) {
                                let token = user.fcmToken;

                                let receiverId = user.id;
                                if (user.optionsId == null ||
                                    user.optionsId.receiveFcm == true)
                                    if (senderId !== receiverId)//не отправлять отправителю пуши
                                        fcm.sendToDevice(token, 'New message', text);

                                // console.log(user);
                            })


                        });

                }
            });

    }

};

