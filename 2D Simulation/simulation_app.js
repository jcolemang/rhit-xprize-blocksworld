var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io')(server),
	path = require('path');

var starting_game_data = new Map();

var recentRoom = -1;
var nextRoom = 0;
var unoccupiedRooms = [];
var numPlayersInRoom = [];
var hmnUser = true
var room_to_join;

app.use(express.static(path.join(__dirname, 'Public')));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/MVP Simulation.html');
});

io.on('connection', function(socket) {

	if (recentRoom >= 0) {
		room_to_join = "Room" + recentRoom;
		socket.join(room_to_join);
		recentRoom = -1;
	} else {
		if (unoccupiedRooms.length != 0) {
			room_to_join = "Room" + unoccupiedRooms[0];
			socket.join(room_to_join);
			recentRoom = unoccupiedRooms[0];
			unoccupiedRooms.splice(0, 1);
		} else {
			room_to_join = "Room" + nextRoom;
			socket.join(room_to_join);
			recentRoom = nextRoom;
			nextRoom++;
		}
	}


	socket.on('username', function(username) {
		socket.username = username;
		console.log(username + ' has connected to the server!');
	});

	socket.on('receive_position', function(data) {
		socket.to(socket.room).emit('update_position', data);
	});

	socket.on('receive_flip_block', function(block_id) {
		socket.to(socket.room).emit('update_flip_block', block_id);
	});

	socket.on('receive_movement_data', function(data) {
		socket.to(socket.room).emit('update_movement_data', data);
	});

	socket.on('receive_gesture_data', function(data) {
		socket.to(socket.room).emit('update_gesture_data', data);
	});

	socket.on('receive_user_message', function(message) {
		io.to(socket.room).emit('update_user_message', message);
	});

	socket.on('end_game_for_all_users', function(time) {
		socket.to(socket.room).emit('end_game_for_user', time);
	});

	socket.on('disconnect', function() {
		// console.log("On disconnect...");
		// console.log("The username of the socket is: " + socket.username);
		// console.log("The room of the current socket is: " + socket.room);
		// console.log("The recent room is: " + recentRoom);
		// console.log("The next room is: " + nextRoom);


		if (recentRoom >= 0) {
			if (socket.room.substring(4) == recentRoom) {
				hmnUser = true;
				recentRoom = -1;
				if (!contains(unoccupiedRooms, socket.room.substring(4))) {
					unoccupiedRooms.push(socket.room.substring(4));
				}
			} else {
				hmnUser = false;
				if (!contains(unoccupiedRooms, socket.room.substring(4))) {
					unoccupiedRooms.push(socket.room.substring(4));
				}
			}
		} else {
			hmnUser = true;
			recentRoom = -1;
			if (!contains(unoccupiedRooms, socket.room.substring(4))) {
				unoccupiedRooms.push(socket.room.substring(4));
			}
		}

		socket.to(socket.room).emit('user_left_game');
	});

	socket.on('setInitialPosition', function(data) {
		console.log("Room to join: " + room_to_join);
		if (hmnUser) {
			starting_game_data.set(room_to_join, data);
			socket.room = room_to_join;
			hmnUser = false;
		} else {
			console.log("Sharing data");
			socket.emit('setInitialPosition', starting_game_data.get(room_to_join));
			socket.room = room_to_join;
			hmnUser = true;
		}
	});
});

server.listen(8080);

function contains(arr, obj) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === obj) {
			return true;
		}
	}

	return false;
}