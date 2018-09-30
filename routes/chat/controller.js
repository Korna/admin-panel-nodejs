const ObjectID = require('mongodb').ObjectID;

let Message = require('../../models/message.js');
let Dialog = require('../../models/dialog.js');
let ChatMember = require('../../models/dialogMember.js');
let DialogMember = require('../../models/dialogMember.js');
let User = require('../../models/user.js');

let fcm = require('../../control/fcm.js');


module.exports.messageList = function (req, res) {
    const dialogId = req.body.dialogId;

    const query = {'dialogId': dialogId};

    Message.find(query)
        .exec((err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                const reversed = item.reverse();
                res.send(reversed);
            }
        });
};


module.exports.messageSend = function (req, res) {
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
            res.send({'error': 'An error has occurred'});
        } else {
            //   console.log(result);
            res.send(result);

            const query = {'dialogId': dialogId};

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
    });



};


module.exports.dialogList = function (req, res) {
    let userId = req.user.id;
    const query = {'memberId': userId};

    ChatMember.find(query).exec(function (err, items) {

        let dialogList = [];
        items.forEach(function (item) {
            dialogList.push(item.dialogId);
        });
        const subquery = {'_id': {$in: dialogList}};

        Dialog.find(subquery).exec((err, items) => {// save second member
            if (err) {
                res.send({'error': 'An error while creating member2'});
            } else {
                res.send(items);//send id of dialog
            }
        });
    });

};


module.exports.dialogCreate = function (req, res) {
    let userId = req.user.id.toString();
    let companionId = req.body.companionId.toString();


    let list = [];
    list.push(userId);
    list.push(companionId);

    const query = {'memberId': {$in: list}};
    console.log('list:' + list);
    ChatMember.find(query).exec(function (err, items) {
        let intList = getIntersect(items, companionId, userId);

        if (intList.length === 0) {
            console.log('creating dialog');
            let dialog = new Dialog();
            let id = new ObjectID();
            dialog._id = id;
            //TODO check                 dialog.date = Date.now();

            dialog.save(//create dialog
                (err, createdDialog) => {
                    if (err) res.send({'error': 'An error while creating dialog'});
                    else {
                        let member1 = new ChatMember();
                        member1.dialogId = id;
                        member1.memberId = userId;
                        member1.save((err, item) => {//save first member
                            if (err) res.send({'error': 'An error while creating member1'});
                            else {
                                let member2 = new ChatMember();
                                member2.dialogId = id;
                                member2.memberId = companionId;
                                member2.save((err, item) => {// save second member
                                    if (err) res.send({'error': 'An error while creating member2'});
                                    else res.send(id);//send id of dialog
                                });


                            }
                        });
                    }
                });
        } else {
            console.log('Found common dialog. Count is:' + intList.length);
            console.log('First dialog:' + intList[0]);
            const val = intList[0];
            res.send(val.toString());//send id of dialog
        }


    });


    function getIntersect(items, companionId, userId) {
        let userDialogs = [];
        let companionDialogs = [];

        items.forEach(function (event) {
            let memberId = event.memberId.toString();
            let dialogId = event.dialogId.toString();
            console.log('memberId:' + memberId + ' userId:' + userId);

            if (companionId === userId) {
                userDialogs.push(dialogId);
                companionDialogs.push(dialogId);
            } else if (userId.toString() === memberId.toString())
                userDialogs.push(dialogId);
            else
                companionDialogs.push(dialogId);
        });

        return intersect(userDialogs, companionDialogs);
        ;
    }

    function intersect(a, b) {
        const setA = new Set(a);
        const setB = new Set(b);
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        return Array.from(intersection);
    }
};