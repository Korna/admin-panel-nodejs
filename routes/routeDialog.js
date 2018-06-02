
const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let Message = require('../models/message.js');
let Dialog = require('../models/dialog.js');
let ChatMember = require('../models/dialogMember.js');


module.exports = function(app, db) {
    app.get('/api/dialogs/my', ctr.isLoggedIn,//get dialog with user
        function(req, res) {
            let userId = req.user.id;

            const query = {'memberId': userId};

            ChatMember.find(query).exec(function(err, items) {

                let dialogList = [];
                items.forEach(function(item) {
                    dialogList.push(item.dialogId);
                });
                const subquery = {'_id': {$in: dialogList}};

                Dialog.find(subquery).exec((err, items) => {// save second member
                    if (err) {
                        res.send({'error':'An error while creating member2'});
                    }else{
                        res.send(items);//send id of dialog
                    }
                });
            });

        });

    app.post('/api/dialogs/create/', ctr.isLoggedIn,//get dialog with user
        function(req, res) {
        let userId = req.user.id;
        let companionId = req.body.companionId;
        if(companionId === undefined){
            res.sendStatus(400).end();
            return ;
        } else
            if(companionId === userId){//TODO make something like message
             //  res.sendStatus(400).end();//cant create dialog with self
             //  return ;
            }


        let list = [];
        list.push(userId);
        list.push(companionId);

            const query = {'memberId':{$in: list}};

            ChatMember.find(query).exec(function(err, items) {
                let intList = getIntersect(items, companionId, userId);

                if(intList.length === 0){
                    let dialog = new Dialog();
                    let id = new ObjectID();
                    dialog._id = id;

                    dialog.save(//create dialog
                        (err, createdDialog) => {
                            if (err) {
                                res.send({'error':'An error while creating dialog'});
                            } else {
                                let member1 = new ChatMember();
                                member1.dialogId = id;
                                member1.memberId = userId;
                                member1.save((err, item) => {//save first member
                                    if (err) {
                                        res.send({'error':'An error while creating member1'});
                                    }else {
                                        let member2 = new ChatMember();
                                        member2.dialogId = id;
                                        member2.memberId = companionId;
                                        member2.save((err, item) => {// save second member
                                            if (err) {
                                                res.send({'error':'An error while creating member2'});
                                            }else{
                                                res.send(id);//send id of dialog
                                            }
                                        });



                                    }
                                });
                            }
                        });
                }else{
                    console.log('Found common dialog. Count is:' + intList.length);
                    console.log('First dialog:' + intList[0]);
                    const val = intList[0];
                    res.send(val.toString());//send id of dialog
                }


            });



        });

    function getIntersect(items, companionId, userId) {
        let userDialogs = [];
        let companionDialogs = [];

        items.forEach(function(event) {
            let memberId = event.memberId;
            let dialogId = event.dialogId;
            console.log('memberId:' + memberId + ' userId:' + userId);

            if(companionId === userId){
                userDialogs.push(dialogId);
                companionDialogs.push(dialogId);
            }else
            if(userId == memberId)
                userDialogs.push(dialogId);
            else
                companionDialogs.push(dialogId);
        });

        console.log('Userlist:' + userDialogs);
        console.log('Companionlist:' + companionDialogs);

        let intList = intersect(userDialogs, companionDialogs);
        console.log('IntList:' + intList);
        return intList;
    }

    function intersect(a, b) {
        const setA = new Set(a);
        const setB = new Set(b);
        const intersection = new Set([...setA].filter(x => setB.has(x)));
        return Array.from(intersection);
    }


};