exports.joinRoom = function(socket, room) {
	socket.join(room);
};

exports.leaveRoom = function(socket, room) {
	socket.leave(room);
};

exports.getRoomClientCount = function(room, cb) {
	
};