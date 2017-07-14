var https = require('https');
var fs = require('fs');

var options = {
	key: fs.readFileSync('/etc/ssl/private/ibm-mvpsim.key'),
	cert: fs.readFileSync('/etc/ssl/ibm-mvpsimulator_rose-hulman_edu_cert.cer')
};

var app = https.createServer(options);

var	io = require('socket.io').listen(app),
	path = require('path');
//  io.set("origins","*");
//app.listen(8080, "0.0.0.0");
app.listen(8080);
var server = https.createServer(options);
var survey_io = require('socket.io').listen(server);
//survey_io.set("origins","*");
server.listen(1023);
//server.listen(1023, "0.0.0.0");

var pg = require("pg");

var conString = "pg://postgres:bgoyt6@137.112.92.17:5432/AIxprize";

var client = new pg.Client(conString);
client.connect();

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
var game_times = new Map();

var recentRoom = -1;
var nextRoom = 0;
var unoccupiedRooms = [];
var numPlayersInRoom = [];
var hmnUser = true
var room_to_join;

io.on('connection', function(socket) {
console.log("HEREEEEEEEEEE22222222");
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

	socket.on('am_I_second_to_join', function() {
		if (waiting_data.get(socket.room) == null) {
			waiting_data.set(socket.room, true);
			socket.emit('freeze_start');
		} else {
			socket.to(socket.room).emit('unfreeze_start');
		}
	});

	socket.on('enable_blocks_for_player_2', function() {
		socket.to(socket.room).emit('enable_blocks_for_player_2');
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

	//socket.on('end_game_for_all_users', function(time) {
	//	game_times.set(socket.room, time);
	//});

	socket.on('audio_connection', function(id) {
		if (voice_connection_data.get(socket.room) == null) {
			voice_connection_data.set(socket.room, id)
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

	socket.on('disconnect', function() {

		var room = io.sockets.adapter.rooms[socket.room];
		if (socket.room) {
			if (recentRoom >= 0) {
				if (socket.room.substring(4) == recentRoom) {
					hmnUser = true;
					recentRoom = -1;
					if (!room && !contains(unoccupiedRooms, socket.room.substring(4))) {
						unoccupiedRooms.push(socket.room.substring(4));
					}
				} else {
					hmnUser = false;
					if (!room && !contains(unoccupiedRooms, socket.room.substring(4))) {
						unoccupiedRooms.push(socket.room.substring(4));
					}
				}
			} else {
				hmnUser = true;
				recentRoom = -1;
				if (!room && !contains(unoccupiedRooms, socket.room.substring(4))) {
					unoccupiedRooms.push(socket.room.substring(4));
				}
			}
			voice_connection_data.set(socket.room, null);
			waiting_data.set(socket.room, null);
			if (game_times.get(socket.room) != null) {
				socket.to(socket.room).emit('end_game_for_user', game_times.get(socket.room));
			} else {
				socket.to(socket.room).emit('user_left_game');
			}
			
			game_times.set(socket.room, null);
		}
		
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

	socket.on('send_data_to_server', function(data) {
                game_times.set(socket.room, data.time);
                // console.log('time:'+data.time);
                // console.log('task:'+data.task);
                // console.log('b:'+data.b);
                // console.log('W:'+data.W);
                // console.log('G:'+data.G);
                // console.log('bm:'+data.bm);      
                // console.log('br:'+data.br);
                // console.log('pn:'+data.pn);      
                // console.log('pp:'+data.pp);
                // console.log('te:'+data.te);      
                // console.log('ie:'+data.ie);
                // console.log('p:'+data.p);
		console.log("HEREEEEEEEEEE44444");
                var query = client.query("INSERT INTO ibmdb(time, task, b, W, G, bm, br, pn, pp, te, ie, p) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)", [data.time, data.task, data.b, data.W, data.G, data.bm, data.br, data.pn, data.pp, data.te, data.ie, data.p]);

		//client.query("SELECT firstname, lastname FROM emps ORDER BY lastname, firstname");
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    console.log(JSON.stringify(result.rows, null, "    "));
		    client.end();
});
		// In order to access the data, use the following:
		// data.time, data.task, data.bm, data.br, data.pn,
		// data.pp, data.te, data.ie, data.p. All of them
		// should be numbers except for the task, which will
		// be a string of the task.
	});
});


survey_io.on('connection', function(socket) {
        console.log("HEREEEEEEEEEE");
	socket.on('send_survey_data_to_server', function(data) {
console.log("HEREEEEEEEEEE3333");
console.log("q1:"+data.q1);
console.log("q2:"+data.q2);
console.log("q3:"+data.q3);
console.log("q4:"+data.q4);
console.log("q5:"+data.q5);
console.log("q6:"+data.q6);
                var query = client.query("INSERT INTO survey(q1, q2, q3, q4, q5, q6) values($1, $2, $3, $4, $5, $6)", [data.q1, data.q2, data.q3, data.q4, data.q5, data.q6]);
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    console.log(JSON.stringify(result.rows, null, "    "));
		    client.end();
		});
		// This will be for data that is received by the survey.
		// It needs its own Node server so as to not conflict with
		// players connecting to the other one.

		// The data that is used will be data.q1, data.q2, data.q3,
		// data.q4, data.q5, and data.q6.
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
