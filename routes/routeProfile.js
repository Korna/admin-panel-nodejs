const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let Profile = require('../models/profile.js');
let User = require('../models/user');



module.exports = function(app, db) {

    app.get('/api/profile/', ctr.isLoggedIn, //ctr.requireAdmin,
        function(req, res) {
            let userId = req.user.id;
            // const req = req.params.email; // :email



            const details = { '_id': userId };
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

           // db.collection(TABLE_PROFILES).
            Profile.findOne(details, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {
                    if(item != undefined)
                        res.send(item);
                    else
                        res.status(501).end();
                }
            });

           // Profile.
        });

    app.post('/api/profile/updateFcm', ctr.isLoggedIn,
        function(req, res) {
            // const req = req.params.email; // :email
            let userId = req.user.id;
            const fcmToken = req.body.fcmToken;


            var query = { '_id': userId };
            var newvalues = { $set: {'fcmToken': fcmToken } };

            User.updateOne(query, newvalues, (err, item) => {//TODO maybe updateOne is incorrect and we should use update
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



            var profileModel = {
                $set: {

                    'email': req_email,
                    'username': req_username,
                    'city': req_city,
                    'description': req_description,
                    'image' : req_image
                } };

            profileModel.email = req.user.email;

        var query = {
            '_id': userId
        };



        Profile.update(query, profileModel, {upsert: true},
            function(err, data){
                if (err){
                    console.log(err);
                }else{
                    console.log('created');
                    res.send(data);
                }
            });
    });

};