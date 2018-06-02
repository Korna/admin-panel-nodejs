const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    email: {type: String},
    username: {type: String},
    city: {type: String},
    description: {type: String},
    image: {type: String}
});

module.exports =  mongoose.model('Profile', ProfileSchema);