
const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let Message = require('../models/message.js');
let Dialog = require('../models/dialog.js');
let ChatMember = require('../models/dialogMember.js');


module.exports = function(app, db) {

    app.get('/api/messages/:id', //get messages from dialog
        function(req, res) {
            let id = req.params.id;

            const query = { 'dialogId': id };

            Message.find(query)
                .skip(0).limit(100)
                .toArray((err, item) => {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {
                        res.send(item);
                    }
                });
        });



    app.post('/api/dialogs/', //get messages from dialog
        function(req, res) {
          // let userId = req.user.id;
          // let memberId = req.body.id;

            let name = req.body.name;
            let query = {
                '_id': _id
            };

            var model = {
                $set: {
                    'name': name
                } };

            Dialog.update(query, model, {upsert: true},
                function(err, data){
                    if (err){
                        console.log(err);
                    }else{
                        console.log('created');
                        res.send(data);

                        const _id = data._id;

                        ChatMember.update(query, profileModel, {upsert: true},
                            function(err, data){
                                if (err){
                                    console.log(err);
                                }else{
                                    console.log('created');
                                    res.send(data);
                                }
                            });
                    }
                });


        });













    /*app.get('/api/members/', //get messages from dialog
        function(req, res) {
            let id = req.user.id;



            const query = { 'userId': id };

            db.collection(TABLE_MEMBERS).find(query)
                .skip(0).limit(100)
                .toArray((err, item) => {
                    if (err) {
                        res.send({'error':'An error has occurred'});
                    } else {

                        res.send(item);
                    }
                });
        });


    app.post('/api/members/', ctr.isLoggedIn, //ctr.requireAdmin,
        function(req, res) {
            let userId = req.user.id;

            const req_username = req.body.username;
            const req_city = req.body.city;
            const req_description = req.body.description;



            const profile = new Profile(userId, req_email, req_username, req_city, req_description);


            var query = {
                'userId': userId
            };
            var newvalues = {
                $set: {
                    'userId': userId,
                    'email': req_email,
                    'username': req_username,
                    'city': req_city,
                    'description': req_description
                } };
            db.collection(TABLE_PROFILES).update(query, newvalues, { upsert: true },  function(err,data){
                if (err){
                    console.log(err);
                }else{
                    console.log('created');
                    res.send(profile);
                }
            });



        });

    app.get('/api/dialogs/', //get messages from dialog
        function(req, res) {
            let id = req.user.id;

            const idDialog = req.params.idDialog;


            const query = { 'email': email };
            const from = 0;
            const to = 100;

            db.collection(TABLE_DIALOGS).find(query)
                .skip(from).limit(to)
                .toArray((err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(item);
                }
            });
        });

    app.post('/api/dialogs/',
        function(req, res) {
            let id = req.user.id;
            console.log(req.body);

           // const req_idDialog  = req.body.idDialog;
           // const req_text  = req.body.text;
           // const req_time = req.body.timeSent;
            const query = { 'id': id };

            //const message = new Message(req_idDialog, req_text, req_time);

            db.collection(TABLE_DIALOGS).insert(message, (err, result) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    res.send(result.ops[0]);
                }
            });
        });*/

};