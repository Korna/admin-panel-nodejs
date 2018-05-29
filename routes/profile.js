const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');

let Profile = require('../models/profile.js');

const TABLE_PROFILES = 'profiles';
module.exports = function(app, db) {

    app.get('/profile/get/', //ctr.isLoggedIn, ctr.requireAdmin,
        function(req, res) {
            let email = req.user.email;
            // const req = req.params.email; // :email



            const details = { 'email': email };
            const projection = {_id:1, text: "", title: "", image: ""};
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

    app.post('/profile/', //ctr.isLoggedIn, ctr.requireAdmin,
        function(req, res) {
        console.log(req.body);

       // const req_body = req.body.body;
        const req_userName = req.body.userName;
        const req_city = req.body.city;

        //const profile = req.body;


        const profile = new Profile(req_userName, req_city);

        db.collection(TABLE_PROFILES).insert(profile, (err, result) => {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                res.send(result.ops[0]);
            }
        });
    });

};