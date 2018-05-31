
const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');
let Message = require('../models/message.js');

const TABLE_DIALOGS = 'dialogs';
module.exports = function(app, db) {
    app.get('/chat/dialogs/', //get messages from dialog
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

    app.post('/chat/dialogs/',
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
        });

};