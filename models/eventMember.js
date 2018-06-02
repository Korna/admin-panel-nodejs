const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const EventMemberSchema = new Schema({
    eventId: [{
        type: Schema.ObjectId,
        ref: 'Event' }],
    memberId: [{
        type: Schema.ObjectId,
        ref: 'Profile' }]
});
module.exports =  mongoose.model('EventMember', EventMemberSchema);