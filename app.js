const express = require('express'),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3000,
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    MongoClient = require('mongodb').MongoClient,
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    session = require('express-session'),
    configDB = require('./config/database.js');

//connect to MongoDB
mongoose.connect(configDB.url);
const db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connect');
});



// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const multer = require('multer');
let upload = multer({dest: 'upload/'});
const fs = require('fs');

const type = upload.single('recfile');


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//session
app.use(session({
    secret: 'shhsecret',
    resave: true,
    saveUninitialized: false
}));




app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



require('./config/passport')(passport);


let users = require('./routes/users');
let routes = require('./routes/index');

upload = require('./routes/upload')(app, fs, type, path);


let sign = require('./routes/routeSign')(app, db);
let notes = require('./routes/routeNote')(app, db);
let profile = require('./routes/routeProfile')(app, db);

app.use('/', routes);
app.use('/users', users);
//app.use('/', profile);
//app.use('/note_routes', notes)(app, db);


MongoClient.connect(configDB.url, (err, database) => {
    try{
        var db = database.db('dbtest');
    }catch (t){
        console.log(t);
    }
    if (err)
        return console.log(err);

    //require('./routes/note_routes')(app, db);
    // router.use('/note_routes', notes)(app, db);
    try{
        app.listen(port, () => {
            console.log('MongoClient connected. We are live on: ' + port);
        });
    }catch (t){
        console.log(t);
    }


});

app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
  });
});

module.exports = app;
