const ObjectID = require('mongodb').ObjectID;

let fcm = require('../../control/fcm.js');
let Event = require('../../models/event.js');
let EventMember = require('../../models/eventMember.js');

module.exports.eventDelete = function (req, res) {
    const id = req.params.id;
    const details = {'_id': new ObjectID(id)};

    console.log('req.id' + req.params.id);

    Event.remove(details, (err, item) => {
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {
            res.send('Event ' + id + ' deleted!');
        }
    });
};

module.exports.eventCreate = function (req, res) {
    console.log(req.body);
    let userId = req.user.id;

    const req_title = req.body.name;
    const req_body = req.body.description;
    const req_cat = req.body.category;
    const req_image = req.body.image;

    const req_lat = req.body.latitude;
    const req_lon = req.body.longitude;


    const event = new Event();//Object.assign(req.body);
    event.authorId = userId;
    event.name = req_title;
    event.description = req_body;
    event.category = req_cat;
    event.image = req_image;
    event.latitude = req_lat;
    event.longitude = req_lon;

    event.save((err, result) => {
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {
            //res.send(result.ops[0]);
            res.status(200).end();
            fcm.sendToTopic('notes', req_title, req_body);
        }
    });
};

module.exports.eventGet = function (req, res) {
    const id = req.params.id;
    const details = {'_id': new ObjectID(id)};

    Event.findOne(details, (err, item) => {
        if (err) {
            res.send({'error': 'An error has occurred'});
        } else {
            res.send(item);
        }
    });


}

module.exports.eventList = function (req, res) {
    const query = {};
    const from = 0;
    const to = 30;

    Event.find(query).populate('authorId')
        .exec(function (err, items) {

            console.log(items);

            res.send(items);
        });
};

module.exports.eventMyList = function (req, res) {
    const query = {'memberId': req.user.id};
    let itemList = EventMember.find(query)
        .exec(function (err, items) {
            let idList = [];
            items.forEach(function (event) {
                idList.push(event.eventId);
            });
            //return items;

            const subquery = {'_id': {$in: idList}};
            Event.find(subquery).populate('authorId')
                .exec(function (err, items) {

                    res.send(items);
                });
        });
};

module.exports.eventMyCreateList = function (req, res) {
    const query = {'authorId': req.user.id};

    Event.find(query).populate('authorId')
        .exec(function (err, items) {

            res.send(items);
        });
};

module.exports.eventJoin = function (req, res) {
    const eventId = req.body.eventId;
    const userId = req.user.id;

    //console.log('event:' + eventId + ' user:' + userId);

    let eventMember = new EventMember();
    eventMember.eventId = eventId;
    eventMember.memberId = userId;


    eventMember.save(
        (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(item);
            }
        });

};