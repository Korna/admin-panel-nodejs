//id
//  501593929464-und7gbcciv6259n7cc08ums16j0jd99r.apps.googleusercontent.com
let User = require('../../models/user.js');
const googleClientId = '501593929464-und7gbcciv6259n7cc08ums16j0jd99r.apps.googleusercontent.com';
//secret
//  -nzLn-3j0CR_nsW2m48iDJOP
async function verify(token, done, client) {
    const ticket = await client.verifyIdToken({
        idToken: token
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    const email = payload.email;
    User.findOne({ 'email':  email }).catch(error =>
        done(error)).then((user) => {//  [userid, payload.name, payload.email]
        if (!user) {// no user
            //TODO CREATE USER
            let password = 'saltsaltsaltsaltsalt';
            let newUser = new User();
            let id = new ObjectID();
            newUser._id = id;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.optionsId = id;
            newUser.profileId = id;

            newUser.save(function(err) {
                if (err)
                    throw err;
                return done(null, newUser);
            });
        }

        console.log('incorrect login');
        return done(null, user);
    });

}

module.exports = {
    token: function (req, res, done) {
        const token = req.body.token;

        const {OAuth2Client} = require('google-auth-library');
        const client = new OAuth2Client(googleClientId);

        verify(token, done, client).catch(err => {
            return res
                .status(500)
                .json({error: 'something wrong with token', msg: err});
        });
    },


};