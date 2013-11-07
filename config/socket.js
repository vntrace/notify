var redis = require('redis');
var _ = require('underscore');

module.exports = function(io) {

    io.configure('production', function(){
        io.enable('browser client etag');
        io.set('log level', 0);
        io.set('transports', [
            'websocket'
          , 'flashsocket'
          , 'htmlfile'
          , 'xhr-polling'
          , 'jsonp-polling'
        ]);
    });

    io.configure('development', function(){
        io.set('origins','http://notify.me:*');
        io.set('log level', 0);
        io.set("transports", ["websocket", "jsonp-polling", "xhr-polling"]);
    });

    var _prefix_room = "notify:room:";
    var _room_all = "all";

    var connectedUser = 0;

    var getUserRoom = function(userId) {
        return _prefix_room + userId;
    }

    io.sockets.on('connection', function(socket){
        // Connect to default room
        // TODO
        socket.on('addUser', function(userId){
            socket.join(getUserRoom(userId));
            socket.join(_room_all, function(){
                ++connectedUser;
                io.sockets.in(_room_all).emit('join', connectedUser);
            });

            // send notify
            var client = redis.createClient(6379, '127.0.0.1');
            var fields = ["_n", "_m", "_r"];

            client.hmget(userId, fields, function (err, replies) {
                if(err) {
                   return false; 
                }
                io.sockets.in(getUserRoom(userId)).emit('notify', _.object(fields, replies));
                client.quit();
            });           
        });

        socket.on('newFeed', function(feed){
            socket.broadcast.to(_room_all).emit('newFeed', feed);
        });

        socket.on('disconnect', function(){
            --connectedUser;
            io.sockets.in(_room_all).emit('join', connectedUser);
        })
    });

    return io;
};