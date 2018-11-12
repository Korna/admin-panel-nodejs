const ObjectID = require('mongodb').ObjectID;
let ctr = require('../../control/middleware.js');

let Options = require('../../models/options.js');

let Profile = require('../../models/profile.js');
let User = require('../../models/user.js');
let Event = require('../../models/event.js');
let EventMember = require('../../models/eventMember.js');


module.exports.optionsGet = function (req, res) {
    let userId = req.user.id;
    const details = {'_id': userId};

    Options.findOne(details, (err, item) => {
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {
            if (item != undefined)//item found
                res.send(item);
            else{
                res.send(new Options());

            }

        }
    });
};

module.exports.optionsUpsert = function (req, res) {
    let userId = req.user.id;
    const req_receiveFcm = req.body.receiveFcm;

    console.log('body.receive' + req_receiveFcm);
    const model = {
        $set: {
            'receiveFcm': req_receiveFcm
        }
    };
    const query = {'_id': userId};

    Options.update(query, model, {upsert: true},
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('created');
                res.send(data);
            }
        });
};


module.exports.profileGet = function (req, res) {
    let userId = req.user.id;
    const details = {'_id': userId};

    Profile.findOne(details, (err, item) => {
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {
            if (item != undefined)//item found
                res.send(item);
            else{
                res.send(new Profile());
               // res.status(501).end();
            }

        }
    });

};

module.exports.profileUpsert = function (req, res) {
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
            'image': req_image
        }
    };

    profileModel.email = req.user.email;

    var query = {
        '_id': userId
    };


    Profile.update(query, profileModel, {upsert: true},
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log('created');
                res.send(data);
            }
        });
};

module.exports.fcmUpsert = function (req, res) {
    // const req = req.params.email; // :email
    let userId = req.user.id;
    const fcmToken = req.body.fcmToken;


    var query = {'_id': userId};
    var newvalues = {$set: {'fcmToken': fcmToken}};

    User.updateOne(query, newvalues, (err, item) => {//TODO maybe updateOne is incorrect and we should use update
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {
            res.send(item);
        }
    });
};

module.exports.userCreate = function (req, res) {

    User.find({})
        .populate('profileId')
        .exec(function (err, item) {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else
                res.send(item);
        });
};

module.exports.userDelete = function (req, res) {
    const id = req.params.id;
    const query = {'_id': new ObjectID(id)};

    console.log('req.id' + req.params.id);

    User.remove(query, (err, item) => {
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {

            const subquery1 = {'authorId': new ObjectID(id)};

            Event.remove(subquery1, (err, item) => {
                if (err)
                    res.send({'error': 'An error has occurred'});
                else {
                    const subquery2 = {'memberId': new ObjectID(id)};
                    EventMember.remove(subquery2, (err, item) => {
                        if (err) {
                            res.send({'error': 'An error has occurred'});
                        } else {
                            res.send('Cleared user and his events!');

                        }
                    });


                }
            });

        }
    });
};