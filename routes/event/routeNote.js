let ctr = require('../../control/middleware.js');


const prefix = '/api/event/';

const controller = require('./controller.js');


module.exports = function (app, db) {
    //all events
    app.get(prefix + 'list/', ctr.isLoggedIn, controller.eventList);
    //events that user join
    app.get(prefix + 'myList/', ctr.isLoggedIn, controller.eventMyList);
    //created evens by user
    app.get(prefix + 'myCreateList/', ctr.isLoggedIn, controller.eventMyCreateList);
    //delete by id
    app.delete(prefix + ':id', ctr.isLoggedIn, ctr.requireAdmin, controller.eventDelete);
    //get specific event by id
    app.get(prefix + 'get/:id', ctr.isLoggedIn, ctr.requireAdmin, controller.eventGet);
    //create event
    app.post(prefix + 'create/', ctr.isLoggedIn, controller.eventCreate);
    //join event
    app.post(prefix + 'join/', ctr.isLoggedIn, controller.eventJoin);
};
/*
list
let itemList = [];
items.forEach(function(event) {
    itemList.push(event);
});
hashmap
var userMap = {};
users.forEach(function(user) {
    userMap[user._id] = user;
});*/

/*
db.collection(TABLE_NOTES).find(details, projection, (err, item) => {
    if (err) {
        res.send({'error':'An error has occurred'});
    } else {
        res.send(item);
    }
});*/
