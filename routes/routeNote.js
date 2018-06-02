const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let fcm = require('../control/fcm.js');

let Event = require('../models/event.js');


module.exports = function(app, db) {


    app.delete('/api/notes/:id', ctr.isLoggedIn, ctr.requireAdmin, function(req, res) {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };

        console.log('req.id' + req.params.id);

        Event.remove(details, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send('Event ' + id + ' deleted!');
            }
        });
    });


    app.get('/api/notes/get/:id', ctr.isLoggedIn, ctr.requireAdmin, function(req, res) {
        const id = req.params.id;
        const details = { '_id': new ObjectID(id) };
        const projection = {_id:1, text: "", title: "", image: ""};



        /*
        db.collection(TABLE_NOTES).find(details, projection, (err, item) => {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                res.send(item);
            }
        });*/

        Event.findOne(details, (err, item) => {
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
        const to = 30;

        Event.find(query).populate('authorId')
            .exec(function(err, items) {
            let userMap = [];

            items.forEach(function(user) {
                userMap.push(user);

            });
            /* hashmap
            var userMap = {};
            users.forEach(function(user) {
                userMap[user._id] = user;
            });*/

            res.send(userMap);
        });



    });


    app.post('/api/notes/', ctr.isLoggedIn,// ctr.requireAdmin,
        function(req, res) {
        console.log(req.body);
        let userId = req.user.id;

        const req_title = req.body.name;
        const req_body = req.body.description;
        const req_cat = req.body.category;
        const req_image = req.body.image;

        const req_lat = req.body.latitude;
        const req_lon = req.body.longitude;

        //const note = new Note(userId, req_title, req_body, req_cat,
        //    req_image,
        //    req_lat, req_lon);


        const event =  new Event();//Object.assign(req.body);
        event.authorId = userId;
        event.name = req_title;
        event.description = req_body;
        event.category = req_cat;
        event.image = req_image;
        event.latitude = req_lat;
        event.longitude = req_lon;



        event.save((err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                //res.send(result.ops[0]);
                res.status(200).end();
                fcm.sendToTopic('notes', req_title, req_body);
            }
        });
    });
};
