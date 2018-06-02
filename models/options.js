const mongoose = require('mongoose');
let Schema = mongoose.Schema;

const OptionsSchema = new Schema({
    receiveFcm: {type: Boolean}
});

module.exports =  mongoose.model('Options', OptionsSchema);