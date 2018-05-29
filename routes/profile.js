const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');
let User = require('../models/user');
const TABLE_PROFILES = 'profiles';
module.exports = function(app, db) {

    app.get('/profile/get', //ctr.isLoggedIn, ctr.requireAdmin,
        function(req, res) {
        let email = req.user.email;



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

};