const ObjectID = require('mongodb').ObjectID;

let User = require('../models/user.js');
let Event = require('../models/event.js');
let EventMember = require('../models/eventMember.js');

let ctr = require('../control/middleware.js');


module.exports = function(app, db) {

    app.get('/api/users/', ctr.isLoggedIn,
        function(req, res) {

            User.find({})
                .populate('profileId')
                .exec(function(err, items) {
                    if (err) {
                        res.send({'error': 'An error has occurred'});
                    }else
                        res.send(items);
                });
        });

    app.delete('/api/users/:id', ctr.isLoggedIn, //ctr.requireAdmin,
        function(req, res) {
            const id = req.params.id;
            const query = { '_id': new ObjectID(id) };

            console.log('req.id' + req.params.id);

            User.remove(query, (err, item) => {
                if (err) {
                    res.send({'error':'An error has occurred'});
                } else {

                    const subquery1 = { 'authorId': new ObjectID(id) };

                    Event.remove(subquery1, (err, item) => {
                        if (err)
                            res.send({'error':'An error has occurred'});
                        else {

                            const subquery2 = { 'memberId': new ObjectID(id) };

                            EventMember.remove(subquery2, (err, item) => {
                                if (err) {
                                    res.send({'error':'An error has occurred'});
                                } else {
                                    res.send('Cleared user and his events!');

                                }
                            });


                        }
                    });


                }
            });
        });

};