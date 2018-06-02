const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const MessageSchema = new Schema({
    dialogId: {type: String},
    senderId: {type: String,
        ref: 'Profile' },
    text: {type: String},
    timeSent: {type: String}
});

module.exports = mongoose.model('Message', MessageSchema);