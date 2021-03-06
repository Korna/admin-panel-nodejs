const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

let Schema = mongoose.Schema;

const userSchema = mongoose.Schema({
    name: {//nickname
        type: String
    },
    email: {//email
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {//password
        type: String,
        required: true
    },
    admin: {// is admin
        type: Boolean
    },
    fcmToken: {// stored fcm token
        type: String
    },
    secretTfa: {//secret for tfa auth
      type: String
    },
    tfaOn: {//is tfa om
        type: Boolean
    },
    optionsId: {//userid for populate
        type: Schema.ObjectId,
        ref: 'Options'
    },
    profileId: {//userid for populate
        type: Schema.ObjectId,
        ref: 'Profile'
    }

});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', userSchema);

/*
//hashing a password before saving it to the database
userSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
});
*/