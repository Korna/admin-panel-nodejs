const THREAD_MESSAGE = 'message';
const THREAD_TYPING = 'typing';

/*
let redis = require("redis");
//const port = 6379;
//const host = '127.0.0.1';
let redisClient = redis.createClient();//(port, host);

redisClient.on('connect', function() {
    console.log('Connected to Redis');
});
redisClient.on('error', function(err){
    console.log(err);
});
*/


module.exports = function (io) {

    io.sockets.on('connection', function(client){
        let userName;
        console.log("user connected!");
        client.emit(THREAD_MESSAGE, 'please insert username');

        client.on(THREAD_MESSAGE, function(message){
            if (!userName) {
                userName = message;
                console.log(userName + ' is connected :)');
                client.emit(THREAD_MESSAGE, 'Welcome ' + userName);
                client.broadcast.emit(THREAD_MESSAGE, userName + ' is connected');
            } else {
                client.emit(THREAD_MESSAGE, 'me: ' + message);
                client.broadcast.emit(THREAD_MESSAGE, userName + ' says: ' + message);
            }
        });

        client.on(THREAD_TYPING, function(){
            console.log(userName + ' is typing');
            client.emit(THREAD_MESSAGE, 'You are typing');

           // client.broadcast.emit(THREAD_TYPING, true);

            io.sockets.connected[socketid].emit();
        });

        client.on('disconnect', function() {
            if (userName) {
                console.log(userName + " left");
                client.broadcast.emit(THREAD_MESSAGE, userName + ' left');
            }
            else
                console.log("anonymous left");
        });
    });

};