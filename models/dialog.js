const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const DialogSchema = new Schema({
    name: {type: String
    },
    members: [{
        type: Schema.ObjectId,
        ref: 'Profile' }]

});
module.exports =  mongoose.model('Dialog', DialogSchema);