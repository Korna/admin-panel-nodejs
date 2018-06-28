const express = require('express'),
    app = express(),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 3000,
    passport = require('passport'),
    MongoClient = require('mongodb').MongoClient,
    mongoose = require('mongoose'),
    flash = require('connect-flash'),
    session = require('express-session'),
    configDB = require('./config/database.js'),
    initSocket = require('./routes/socketChat.js');


let server = app.listen(port, () => {
    console.log('Server is listening at:' + port);
});

//let io = require('socket.io').listen(process.env.PORT || 3001);
let io = require('socket.io')(server);


//connect to MongoDB
mongoose.connect(configDB.url);
const db = mongoose.connection;
//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Db Connect');
});

MongoClient.connect(configDB.url, (err, database) => {
    if (err)
        return console.log(err);
    try{
        const db = database.db('dbtest');
    }catch (t){
        console.log(t);
    }

    //require('./routes/note_routes')(app, db);
    // router.use('/note_routes', notes)(app, db);
    console.log('MongoClient connected');
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
let routes = require('./routes/pages.js');
app.use('/', routes);
app.use('/users', users);

upload = require('./routes/upload')(app, fs, type, path);


let sign = require('./routes/auth/routeSign')(app, db);
let notes = require('./routes/event/routeNote')(app, db);
let profile = require('./routes/data/routeProfile')(app, db);
let dialog = require('./routes/chat/routeDialog')(app, db);
let message = require('./routes/chat/routeMessage')(app, db);
let options = require('./routes/data/routeOptions')(app, db);
let userz = require('./routes/data/routeUser')(app, db);


//app.use('/', profile);
//app.use('/note_routes', notes)(app, db);


// socket io
/*
io.configure('production', function(){
    io.enable('browser client etag');
    io.set('log level', 1);

    io.set('transports', [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling',
    ]);
});

io.configure('development', function(){
    io.set('transports', ['websocket']);
});
*/


initSocket(io);



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
