const speakeasy = require('speakeasy');
let User = require('../../models/user.js');
const passport = require('passport');

module.exports.signin = [
    passport.authenticate('tfa-user'),
    function (req, res) {
        res.status(200).end();
    },
];

module.exports.create = async function create(req, res, next) {
    try {

        const details = {'email': req.user.email};
        User.findOne(details, (err, item) => {
            if (err) {
                next(err);
            } else {
                console.log(item);

                const tfa = getTfaKey();
                req.session.key = tfa.base32;
                res.status(200).json({
                    key: tfa.base32,
                    otpauth: tfa.otpauth_url,
                });
            }
        });


    } catch (error) {
        next(error);
    }
};

module.exports.active = async function (req, res, next) {
    try {
        if (req.user.tfaOn === true) {
            next(new Error('Already activated'));
        }

        const verified = await checkUserTfa(req.user.id, req.body.token, req.session.key);

        if (verified === true) {
            await setUserTfa(req.user.id, req.session.key);
            res.status(200).send();
        } else {
            next(new Error('Wrong token'));
        }
    } catch (error) {
        next(error);
    }
};

module.exports.delete = async function (req, res, next) {
    try {
        if (req.user.tfaOn === false) {
            next(new Error('Already deleted'));
        }

        const verified = await checkUserTfa(req.user.id, req.body.token, req.user.secretTfa);

        if (verified === true) {
            await setUserTfa(req.user.id, null);
            res.status(200).send();
        } else {
            next(new Error('Wrong token'));
        }
    } catch (error) {
        next(error);
    }
};


module.exports.check = async function (req, res, next) {
    try {
        const auth = await checkUserAuth(req.body.email);
        res.status(200).send(auth);
    } catch (error) {
        next(error);
    }
};

function getTfaKey() {
    return speakeasy.generateSecret({
        length: 20,
    });
}

function checkUserTfa(userId, token, sessionKey) {
    return new Promise((resolve, reject) => {
        const details = {'_id': userId};

        User.findOne(details, (err, item) => {
            if (err) {
                reject(error);
            } else {
                const verified = speakeasy.totp.verify({
                    secret: sessionKey,
                    encoding: 'base32',
                    token,
                });
                resolve(verified);
            }
        });
    });
}

function setUserTfa(userId, sessionKey = null) {
    return new Promise((resolve, reject) => {
        const auth = (sessionKey !== null);

        const query = {'_id': userId};
        const newvalues = {
            $set: {
                'secretTfa': sessionKey,
                'tfaOn': auth
            }
        };

        User.updateOne(query, newvalues, (err, item) => {//TODO maybe updateOne is incorrect and we should use update
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });


    });
}

function checkUserAuth(email) {
    return new Promise((resolve, reject) => {
        const details = {'email': email};
        User.findOne(details, (err, item) => {
            if (err) {
                reject(error);
            } else {
                // console.log(user);

                if (item !== null && item.tfaOn === true) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        });

    });
}
