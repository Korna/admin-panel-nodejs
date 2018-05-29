const ObjectID = require('mongodb').ObjectID;
let ctr = require('../control/middleware.js');
const TABLE_PROFILES = 'profiles';
module.exports = function(app, db) {

    app.get('/notes/get/:id', ctr.isLoggedIn, ctr.requireAdmin, function(req, res) {
        const id = req.params.id;

        const details = { 'email': new ObjectID(id) };
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