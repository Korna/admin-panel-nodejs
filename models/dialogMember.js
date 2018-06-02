const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const DialogMemberSchema = new Schema({
    dialogId: [{
        type: Schema.ObjectId,
        ref: 'Dialog' }],
    memberId: [{
        type: Schema.ObjectId,
        ref: 'Profile' }]
});
module.exports = mongoose.model('DialogMember', DialogMemberSchema);