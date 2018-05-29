
let isLoggedIn = require('../control/middleware').isLoggedIn;


module.exports = function(app, fs, type, path) {
    app.get("/upload/:name", isLoggedIn, function(req, res) {
        const name = req.params.name;
        res.sendFile(path.resolve('./upload/' + name));
    });

    app.post('/upload', type, isLoggedIn, requireAdmin, function (req,res) {
        const tmp_path = req.file.path;
        const target_path = 'upload/' + req.file.originalname;

        const src = fs.createReadStream(tmp_path);
        const dest = fs.createWriteStream(target_path);
        src.pipe(dest);
        src.on('end', function() {
            console.log("Upload completed!");
          //  res.render('complete');
        });
        src.on('error', function(err) {
            console.error(err);
        });
    });

};
/*
function isLoggedIn(req, res, next) {
    console.log('Authenticated:' + req.isAuthenticated());

    if (req.isAuthenticated())
        return next();
    else{
        res.status(403);
        res.send({ 'error': 'You are not authenticated' });
    }
}*/

const User = require('../models/user');

function requireAdmin(req, res, next) {
    User.findOne({ 'email':  req.user.email }, function(err, user) {
        if (err)
            return next(err);

        if(!user){
          //  res.status(404);
            res.send({ 'error': 'You are not authenticated' });
        }else
        if(!user.admin){
          //  res.status(403);
            res.send({ 'error': 'You are not Admin' });
        }else
            next();

    });
}