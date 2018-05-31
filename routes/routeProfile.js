const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let Profile = require('../models/profile.js');

const TABLE_PROFILES = 'profiles';
module.exports = function(app, db) {

    app.get('/profile/get/', //ctr.isLoggedIn, ctr.requireAdmin,
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
                    res.send(item);
                }
            });
        });

    app.post('/profile/updateFcm/', //ctr.isLoggedIn, ctr.requireAdmin, TODO change whole route
        function(req, res) {
            // const req = req.params.email; // :email
            let userId = req.user.id;
            const fcmToken = req.body.fcmToken;

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


            /*
                collection.update(
                {_id: ObjectId(req.session.userID)},
                {$set: req.body }
                )
             */

            var query = { 'userId': userId };
            var newvalues = { $set: {'fcmToken': fcmToken } };

            db.collection(TABLE_PROFILES).updateOne(query, newvalues, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    res.send(item);
                }
            });
        });

    app.post('/profile/', //ctr.isLoggedIn, ctr.requireAdmin,
        function(req, res) {
        let userId = req.user.id;
        const details = { 'userId': userId };
       // console.log(req.body);


       // const req_body = req.body.body;

        const req_userName = req.body.userName;
        const req_city = req.body.city;
        const req_email = req.body.email;

        //const profile = req.body;

        const profile = new Profile(userId, req_email, req_userName, req_city);

        db.collection(TABLE_PROFILES).insert(profile, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

};