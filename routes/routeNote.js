const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let Note = require('../models/note.js');


const TABLE_NOTES = 'notes';

module.exports = function(app, db) {

    app.put ('/api/notes/:id', ctr.isLoggedIn, ctr.requireAdmin, function(req, res) {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };


        const note = new Note(req.body.body, req.body.title);

        db.collection(TABLE_NOTES).update(details, note, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(note);
            }
        });
    });

    app.delete('/api/notes/:id', ctr.isLoggedIn, ctr.requireAdmin, function(req, res) {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        console.log('req.id' + req.params.id);

        db.collection(TABLE_NOTES).remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('Note ' + id + ' deleted!');
            }
        });
    });


    app.get('/api/notes/get/:id', ctr.isLoggedIn, ctr.requireAdmin, function(req, res) {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const projection = {_id:1, text: "", title: "", image: ""};

        console.log('req.id' + req.params.id);

        /*
        db.collection(TABLE_NOTES).find(details, projection, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });*/

        db.collection(TABLE_NOTES).findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    app.get('/api/notes/all/', ctr.isLoggedIn, function(req, res) {

        console.log('req.id' + req.params.id);
        const query = {};
        const from = 0;
        const to = 15;

        db.collection(TABLE_NOTES).find(query)
            .skip(from).limit(to).toArray((err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });


    app.post('/api/notes/', ctr.isLoggedIn,// ctr.requireAdmin,
        function(req, res) {
        console.log(req.body);
        let userId = req.user.id;

        const req_body = req.body.body;
        const req_title = req.body.title;
        const req_cat = req.body.category;


        const note = new Note(userId, req_body, req_title, req_cat);

        db.collection(TABLE_NOTES).insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });
};
