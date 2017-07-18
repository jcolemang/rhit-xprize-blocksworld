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
var game_times = new Map();
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
		if (unoccupiedRooms.length != 0) {
			room_to_join = "Room" + unoccupiedRooms[0];
			socket.join(room_to_join);
			socket.room = room_to_join;
			recentRoom = unoccupiedRooms[0];
			unoccupiedRooms.splice(0, 1);
		} else {
			room_to_join = "Room" + nextRoom;
			socket.join(room_to_join);
			socket.room = room_to_join;
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

	socket.on('end_button_pressed', function() {
		going_to_surveys.set(socket.room, true);
		socket.to(socket.room).emit('end_game_for_user', game_times.get(socket.room));
	});

	socket.on('disconnect', function() {
		var room = io.sockets.adapter.rooms[socket.room.substring(4)];

		if (going_to_surveys.get(socket.room) == null) {
			socket.to(socket.room).emit('user_left_game');
			going_to_surveys.set(socket.room, null);
		}

		if (room == null || io.sockets.adapter.rooms[socket.room].length == 0) {
			unoccupiedRooms.push(socket.room.substring(4));
			recentRoom = -1;		
		} else {
			voice_connection_data.set(socket.room, null);
			waiting_data.set(socket.room, null);
			game_times.set(socket.room, null);
		}
		
	});

	socket.on('setInitialPosition', function(data) {
		console.log("Room to join: " + socket.room);
		if (io.sockets.adapter.rooms[socket.room].length == 1) {
			starting_game_data.set(socket.room, data);
		} else {
			console.log("Sharing data");
			socket.emit('setInitialPosition', starting_game_data.get(socket.room));
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
		 // console.log('Action:'+data.action);
  		
  		var query = client.query("INSERT INTO ibm(time, task, b, W, G, bm, br, pn, pp, te, ie, p, timeAndLocation) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)", [data.time, data.task, data.b, data.W, data.G, data.bm, data.br, data.pn, data.pp, data.te, data.ie, data.p, data.Action]);
		
		query.on("row", function (row, result) {
		    result.addRow(row);
		});
		query.on("end", function (result) {
		    console.log(JSON.stringify(result.rows, null, "    "));
		});
	});

	socket.on('send_survey_data_to_server', function(data) {
		// console.log('q1:'+data.q1);      
		// console.log('q2:'+data.q2);
		// console.log('q3:'+data.q3);

		// console.log('q11:'+data.q11);      
		// console.log('q22:'+data.q22);
		// console.log('q33:'+data.q33);
		// console.log('q4:'+data.q4);      
		// console.log('q5:'+data.q5);
		// console.log('q6:'+data.q6);

		var query1, query2;
		
		if (data.q4 != null) { 
			query1 = client.query("INSERT INTO human_survey(q1, q2, q3, q4, q5, q6) values($1, $2, $3, $4, $5, $6)", [data.q11, data.q22, data.q33, data.q4, data.q5, data.q6]);
		} else {
 			query2 = client.query("INSERT INTO Rsurvey(q1, q2, q3) values($1, $2, $3)", [data.q1, data.q2, data.q3]);
		}
		
		if(query1!=null) {		
			query1.on("row", function (row, result) {
		    	result.addRow(row);
			});
			query1.on("end", function (result) {
		    	console.log(JSON.stringify(result.rows, null, "    "));
   			});
		}

		if(query2!=null) {
			query2.on("row", function (row, result) {
                result.addRow(row);
            });
            query2.on("end", function (result) {
                console.log(JSON.stringify(result.rows, null, "    "));
		        client.end();
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
