module.exports = class Note{

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

