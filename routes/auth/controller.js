module.exports.signup = function (req, res, next) {
    res.status(200).end();
};

module.exports.signin = function (req, res, next) {
    res.status(200).end();
};

module.exports.logout = (req, res) => {
    req.logout();
    req.session = null;
    res.status(200).end();
};


module.exports.googleauth = (req, res) => {
    console.log(req.user.token);
    req.session.token = req.user.token;
    res.status(200).end();
};


