const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const EventSchema = new Schema({
    authorId: {
        type: Schema.ObjectId,
        ref: 'Profile' },
    name: {type: String},
    description: {type: String},
    category: {type: String},
    image: {type: String},
    latitude: {type: Number},
    longitude: {type: Number},
    members: [{
        type: Schema.ObjectId,
        ref: 'Profile' }],
    memberCount: {type: Number}
});

module.exports =  mongoose.model('Event', EventSchema);