var redis = require('redis');
var _ = require('underscore');
var when = require('when');

var _prefix_room = "notify:room:";
var getUserRoom = function(userId) {
    return _prefix_room + userId;
}

module.exports = function(app, io) {

	/**
	 * [description]
	 * @param  {[type]} req [description]
	 * @param  {[type]} res [description]
	 * @return {[type]}     [description]
	 */
	app.get('/api/notify', function(req, res){

		var userIds = req.query.userIds;
			userIds = userIds.split(',');

		var client = redis.createClient(6379, '127.0.0.1');

		var fields = ["_n", "_m", "_r"];

		function sendNotify(userId) {
			var deferred = when.defer();
			client.hmget(userId, fields, function (err, replies) {
				if(err) {
					deferred.reject(new Error('Get hash key error'));
				} else {
					io.sockets.in(getUserRoom(userId)).emit('notify', _.object(fields, replies));
					deferred.resolve(true);
				}
		    });

		    return deferred.promise;
		};

		function sendNotifyToAll(userIds) {
			var deferreds = [];
			for(var i = 0,l = userIds.length; i < l; i++) {
			    deferreds.push(sendNotify(userIds[i]));
			}

			return when.all(deferreds);
		}

		sendNotifyToAll(userIds).then(function(){
			client.quit();
		});

		res.send('OK');
	});
};