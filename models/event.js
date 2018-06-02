/*module.exports = class Note{

    constructor(authorId, title, text, category, image, latitude, longitude) {
        this.authorId = authorId;
        this.name = title;
        this.description = text;
        this.category = category;
        this.image = image;
        this.latitude = latitude;
        this.longitude = longitude;
    }

};


*/
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
        ref: 'Profile' }]
});

module.exports =  mongoose.model('Event', EventSchema);