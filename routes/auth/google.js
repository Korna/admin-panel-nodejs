//id
//  501593929464-und7gbcciv6259n7cc08ums16j0jd99r.apps.googleusercontent.com
let User = require('../../models/user.js');
//secret zhTv4ohFqHkUKxKEz2O2pRph
const googleClientId = '986346989014-4sjsthpnbabjvaipf3f4tigf6e7sqcce.apps.googleusercontent.com';
const ObjectID = require('mongodb').ObjectID;

async function verify(token, done, client, res, req) {
    const ticket = await client.verifyIdToken({
        idToken: token
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    const email = payload.email;

    req.body.email = email;
    req.body.password = 'saltsaltsaltsalt';

    User.findOne({'email': email}).catch(error =>
        done(error)).then((user) => {//  [userid, payload.name, payload.email]


        if (!user) {// no user
            let password = 'saltsaltsaltsalt';
            let newUser = new User();
            let id = new ObjectID();
            newUser._id = id;
            newUser.email = email;
            newUser.password = newUser.generateHash(password);
            newUser.optionsId = id;
            newUser.profileId = id;

            newUser.save(function (err) {
                console.log('new user');
                if (err)
                    throw err;
                return done(null, newUser);
            });
        } else {
            console.log('existing user');
            return done(null, user);
        }

    });

}

module.exports = {
    handleToken: function (passport) {
        return function (req, res, next) {
            passport.authenticate('token', function (err, user, info) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    return next();
                }
                return res.json(info);
            })(req, res, next);
        };
    },


    token: function (req, res, done) {
        const token = req.body.token;
        if(token === undefined){
            console.log('no token');
            return res.status(400).json({error: 'No token specified', msg: req.body});
        }


        const {OAuth2Client} = require('google-auth-library');
        const client = new OAuth2Client(googleClientId);

        verify(token, done, client, res, req).catch(err => {
            return res.status(500)
                .json({error: 'something wrong with token', msg: err});
        });
    }
};