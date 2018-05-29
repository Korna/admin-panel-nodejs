const ObjectID = require('mongodb').ObjectID;

const admin = require('firebase-admin');

const serviceAccount = require('../config/serviceKey.json');

let ctr = require('../control/middleware.js');

let Note = require('../models/note.js');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://proteus0project.firebaseio.com"
});

const device = 'dYYbIvxrn_E:APA91bG5NJSlt5YboaeuSXM7Hqmhh0kBkaDNjp-go1CakqqlTVzSo_mGRL3p5KoRzFQy3sbv4VK6M6_iEejH4hvrmUWJ7mzp4KfxW5IqAf36WHAYjqIi9cP4FaZpskV4t4JwngaOaAbb';

function sendToTopics(title, body){
    const payload = {
        notification: {
            title: title,
            body: body
        },
    };

    admin.messaging().sendToDevice(device, payload)
        .then((response) => {
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });

}


module.exports = function(app, db) {
    app.put ('/notes/:id', ctr.isLoggedIn, requireAdmin, function(req, res) {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

      //  const note = { text: req.body.body, title: req.body.title };
        const note = new Note(req.body.body, req.body.title);

        db.collection('notes').update(details, note, (err, result) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(note);
            }
        });
    });

    app.delete('/notes/:id', ctr.isLoggedIn, requireAdmin, function(req, res) {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('Note ' + id + ' deleted!');
            }
        });
    });


    app.get('/notes/get/:id', ctr.isLoggedIn, requireAdmin, function(req, res) {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        db.collection('notes').findOne(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    app.get('/notes/all/', ctr.isLoggedIn, function(req, res) {
        const query = {};
        const from = 0;
        const to = 15;

        db.collection('notes').find(query).skip(from).limit(to).toArray((err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });


    app.post('/notes/', ctr.isLoggedIn, requireAdmin, function(req, res) {
        console.log(req.body);

        const req_body = req.body.body;
        const req_title = req.body.title;
        const req_image = req.body.image;

       /* const note = {
            body: req_body,
            title: req_title,
            image: req_image
        };*/
        const note = new Note(req_body, req_title, req_image);

        db.collection('notes').insert(note, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);

                sendToTopics(req_title, req_body);
            }
        });
    });
};
/*
function isLoggedIn(req, res, next) {
    console.log('Authenticated:' + req.isAuthenticated());
    // console.log('User:' + req.user.body);

    if (req.isAuthenticated())
        return next();
    else{
        res.status(403);
        res.send({ 'error': 'You are not authenticated' });
    }
}*/

var User = require('../models/user');
function requireAdmin(req, res, next) {
    User.findOne({ 'email':  req.user.email }, function(err, user) {
        if (err)
            return next(err);


        if(!user.admin){
            res.status(403);
            res.send({ 'error': 'You are not Admin' });
        }else
            next();
    });
}