var https = require('https');
var fs = require('fs');

var options = {
	key: fs.readFileSync('/etc/ssl/private/ibm-mvpsim.key'),
	cert: fs.readFileSync('/etc/ssl/ibm-mvpsimulator_rose-hulman_edu_cert.cer')
};

var app = https.createServer(options);

var	io = require('socket.io').listen(app),
	path = require('path');

app.listen(8080, "0.0.0.0");

Object.keys(io.sockets.sockets).forEach(function(s) {
	var socket = io.sockets.sockets[s];
	socket.disconnect(true);
	io.sockets.in(socket.room).leave(socket.room);
});

var pg = require("pg");

var conString = "pg://postgres:bgoyt6@137.112.92.17:5432/AIxprize";

var client = new pg.Client(conString);
client.connect();

//var survey_app = https.createServer(options);
//var survey_io = require('socket.io').listen(survey_app);

//survey_app.listen(8081, "0.0.0.0");

// var PeerServer = require('peer').PeerServer;
// var peerServer = PeerServer({
// 	host: 'https://blockworld.rose-hulman.edu', 
// 	port: 9000, 
// 	path: '/var/www/html/',
// 	ssl: {
// 		key: fs.readFileSync('/etc/ssl/private/ibm-mvpsim.key'),
// 		cert: fs.readFileSync('/etc/ssl/ibm-mvpsimulator_rose-hulman_edu_cert.cer')
// 	}
// });

var starting_game_data = new Map();
var voice_connection_data = new Map();
var waiting_data = new Map();
var going_to_surveys = new Map();

var recentRoom = -1;
var nextRoom = 0;
var unoccupiedRooms = [];
var room_to_join;

io.on('connection', function(socket) {

	if (recentRoom >= 0) {
		room_to_join = "Room" + recentRoom;
		socket.join(room_to_join);
		socket.room = room_to_join;
		recentRoom = -1;
	} else {
		room_to_join = "Room" + nextRoom;
		socket.join(room_to_join);
		socket.room = room_to_join;
		recentRoom = nextRoom;
		nextRoom++;
	}

	socket.on('am_I_second_to_join', function() {
		if (waiting_data.get(socket.room) == null) {
			waiting_data.set(socket.room, true);
			socket.emit('freeze_start');
		} else {
			socket.to(socket.room).emit('unfreeze_start');
		}
	});

	socket.on('enable_blocks_for_player_2', function(data) {
		socket.to(socket.room).emit('enable_blocks_for_player_2', data);
	});

	socket.on('disable_blocks_for_player_2', function() {
		socket.to(socket.room).emit('disable_blocks_for_player_2');
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

	socket.on('audio_connection', function(id) {
		if (voice_connection_data.get(socket.room) == null) {
			voice_connection_data.set(socket.room, id);
		} else {
			socket.emit('audio_connection', voice_connection_data.get(socket.room));
		}
	});

	socket.on('reset_audio_id', function() {
		voice_connection_data.set(socket.room, null);
		socket.to(socket.room).emit('alert_human_disconnect');
	});

	socket.on('human_reconnected', function() {
		socket.to(socket.room).emit('alert_human_reconnected', voice_connection_data.get(socket.room));
	});

	socket.on('end_button_pressed', function(data) {
		going_to_surveys.set(socket.room, true);
		socket.to(socket.room).emit('end_game_for_user', data);
	});

	socket.on('disconnect', function() {
		if (recentRoom >= 0) {
			recentRoom = -1;
		}

		var room = io.sockets.adapter.rooms[socket.room];

		if (going_to_surveys.get(socket.room) == null) {
			io.to(socket.room).emit('user_left_game');
			going_to_surveys.set(socket.room, null);
		}

		// if (room == null || io.sockets.adapter.rooms[socket.room].length == 0) {
		// 	//unoccupiedRooms.push(socket.room.substring(4));
		// 	starting_game_data.set(socket.room, null);
		// }

		starting_game_data.set(socket.room, null);
		voice_connection_data.set(socket.room, null);
		waiting_data.set(socket.room, null);
	});

	socket.on('setInitialPosition', function(data) {
		console.log("Room to join: " + socket.room);
		if (starting_game_data.get(socket.room) == null) {
			starting_game_data.set(socket.room, data);
		} else {
			console.log("Sharing data");
			socket.emit('setInitialPosition', starting_game_data.get(socket.room));
		}
	});

	socket.on('send_data_to_server', function(data) {

  		var query = client.query("INSERT INTO ibmdb(Time, Task, b, W, G, bm, br, pn, pp, te, ie, p, TimeAndLocation, InitialInfo, SearchWords) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)", [data.time, data.task, data.b, data.W, data.G, data.bm, data.br, data.pn, data.pp, data.te, data.ie, data.p, data.Action, data.initialInfo, data.other]);

		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    console.log(JSON.stringify(result.rows, null, "    "));
		});
	});

	socket.on('send_survey_data_to_server', function(data) {
		var query1, query2;
		var count = 1;

		if (data.q4 != null) {
			query1 = client.query("INSERT INTO human_survey(q1, q2, q3, q4, q5, q6) values($1, $2, $3, $4, $5, $6)", [data.q1, data.q2, data.q3, data.q4, data.q5, data.q6]);
		} else {
 			query2 = client.query("INSERT INTO robot_survey(q1, q2, q3) values($1, $2, $3)", [data.q1, data.q2, data.q3]);
		}

		if(query1!=null) {
			query1.on("row", function (row, result) {
		    	result.addRow(row);
			});
			query1.on("end", function (result) {
		    	console.log(JSON.stringify(result.rows, null, "    "));
		    	if(count === 0) {
		        	client.end();
		        }
		        else {
		        	count = 0;
		        }
   			});
		}

		if(query2!=null) {
			query2.on("row", function (row, result) {
                result.addRow(row);
            });
            query2.on("end", function (result) {
                console.log(JSON.stringify(result.rows, null, "    "));
                if(count === 0) {
		        	client.end();
		        }
		        else {
		        	count = 0;
		        }
   		    });
		}
	});
});

function contains(arr, obj) {
	var i = arr.length;
	while (i--) {
		if (arr[i] === obj) {
			return true;
		}
	}

	return false;
}
