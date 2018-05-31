
const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');
let Message = require('../models/message.js');

const TABLE_MESSAGES = 'messages';

module.exports = function(app, db) {

    app.get('/chat/messages/:idDialog', //get messages from dialog
        function(req, res) {
            let email = req.user.email;

            const idDialog = req.params.idDialog;



           // const details = { 'email': email };

            const query = {'idDialog': idDialog};
            const from = 0;
            const to = 100;

            db.collection(TABLE_MESSAGES).find(query)
                .skip(from).limit(to)
                .toArray((err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(item);
                }
            });
        });

    app.post('/chat/message/',
        function(req, res) {
            console.log(req.body);

            const req_idDialog  = req.body.idDialog;
            const req_text  = req.body.text;
            const req_time = req.body.timeSent;


            const message = new Message(req_idDialog, req_text, req_time);

            db.collection(TABLE_MESSAGES).insert(message, (err, result) => {
                if (err) {
                    res.send({ 'error': 'An error has occurred' });
                } else {
                    res.send(result.ops[0]);
                }
            });
        });

};