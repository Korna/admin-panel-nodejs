const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let Profile = require('../models/profile.js');

const TABLE_PROFILES = 'profiles';
const TABLE_USERS = 'users';

module.exports = function(app, db) {

    app.get('/api/profile/', ctr.isLoggedIn, //ctr.requireAdmin,
        function(req, res) {
            let userId = req.user.id;
            // const req = req.params.email; // :email



            const details = { 'userId': userId };
         //   const projection = {_id:1, text: "", title: "", image: ""};
            //const
            /*
            db.collection(TABLE_NOTES).find(details, projection, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(item);
                }
            });*/

            db.collection(TABLE_PROFILES).findOne(details, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    if(item != undefined)
                        res.send(item);
                    else
                        res.status(501).end();
                }
            });
        });

    app.post('/api/updateFcm/', ctr.isLoggedIn,// ctr.requireAdmin, TODO change whole route
        function(req, res) {
            // const req = req.params.email; // :email
            let userId = req.user.id;
            const fcmToken = req.body.fcmToken;


            var query = { 'id': userId };
            var newvalues = { $set: {'fcmToken': fcmToken } };

            db.collection(TABLE_USERS).updateOne(query, newvalues, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(item);
                }
            });
        });

    app.post('/api/profile/', ctr.isLoggedIn, //ctr.requireAdmin,
        function(req, res) {
        let userId = req.user.id;
        const req_email = req.user.email;

        const req_username = req.body.username;
        const req_city = req.body.city;
        const req_description = req.body.description;
        const req_image = req.body.image;



        const profile = new Profile(userId, req_email, req_username, req_city, req_description, req_image);


        var query = {
            'userId': userId
        };
        var newvalues = {
            $set: {
            'userId': userId,
                'email': req_email,
                'username': req_username,
                'city': req_city,
                'description': req_description,
                'image' : req_image
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

};