/**
 * Node js bootstrap
 * Copyright by clgt team
 * @author clgt@clgt.vn
 */
var express = require("express");
var fs = require('fs');

/**
 * Load configuration
 */
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

// Shorthand, because i'm lazy :)
var app = express();

// Enabled trust proxy setting
app.enable('trust proxy');

// express setting
require('./config/express')(app, config);


var port = process.env.PORT || 5000;

var server = require('http').createServer(app);
//var io = require('socket.io').listen(server);
var io = require('socket.io');

io = io.listen(server.listen(port));

// io.server.removeListener('request', io.server.listeners('request')[0]);

// Socket.io configuration
io = require('./config/socket')(io);

// route
require('./config/routes')(app, io);

// server.listen(port);

console.log('Your awesome app has started on port ' + port);

exports = module.exports = app;