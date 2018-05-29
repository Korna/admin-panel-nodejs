function isLoggedIn(req, res, next) {
    console.log('Authenticated:' + req.isAuthenticated());
    // console.log('User:' + req.user.body);

    if (req.isAuthenticated())
        return next();
    else{
        res.status(403);
        res.send({ 'error': 'You are not authenticated' });
    }
}

module.exports.isLoggedIn = isLoggedIn;