let User = require('../models/user');


module.exports = {

    isLoggedIn: function (req, res, next) {
        console.log('Authenticated:' + req.isAuthenticated());
        // console.log('User:' + req.user.body);

        if (req.isAuthenticated())
            return next();
        else {
            res.status(403);
            res.send({'error': 'You are not authenticated'});
        }
    },

    requireAdmin: function (req, res, next) {
        User.findOne({'email': req.user.email}, function (err, user) {
            if (err)
                return next(err);


            if (!user.admin) {
                res.status(403);
                res.send({'error': 'You are not Admin'});
            } else
                next();
        });
    },

    checkIfItself: function (req, res, next) {
        let userId = req.user.id.toString();
        let companionId = req.body.companionId.toString();

        if (companionId === undefined) {
            res.sendStatus(400).end();
        } else if (companionId === userId) {//TODO make something like message
            res.sendStatus(400).end();//cant create dialog with self
        }
    }


};