var redis = require('redis');
var _ = require('underscore');
var when = require('when');

exports.getNotification = function(userId, callback) {
	var client = redis.createClient(6379, '127.0.0.1');
	var fields = ["_n", "_m", "_r"];
};