
// var https = require('https');
var https = require('http');
var path = require('path');
var fs = require('fs');
var config = require('./serverConfig.js')(true);
var	io = require('socket.io');
var pg = require("pg");

var connect_sem = require('semaphore')(1);
var init_sem = require('semaphore')(2);

var client = new pg.Client(config.pgConString);
client.connect();

console.log(config.pgConString);

let q = client.query('SELECT * FROM ibmdb;');
q.on('row', (row) => {
    console.log(row);
});

// var options = {
// 	key: fs.readFileSync('/etc/ssl/private/ibm-mvpsim.key'),
// 	cert: fs.readFileSync('/etc/ssl/ibm-mvpsimulator_rose-hulman_edu_cert.cer')
// };

let createServer = function(config) {
    let server;
    if (config.isLocal) {
        let http = require('http');
        server = http.createServer();
    } else {
        let https = require('https');
        server = https.createServer(config.serverOptions);
    }

    return server;
};

let server_app = createServer(config);
server_app.listen(8080);
var appListener = io.listen(server_app);

Object.keys(appListener.sockets.sockets).forEach(function(s) {
    var socket = appListener.sockets.sockets[s];
    socket.disconnect(true);
    appListener.sockets.in(socket.room).leave(socket.room);
});

var starting_game_data = new Map();
var voice_connection_data = new Map();
var going_to_surveys = new Map();

var recentRoom = -1;
var nextRoom = 0;
var room_to_join;

console.log('app_io connection thing');
appListener.sockets.on('connection', function(socket) {

    console.log('Connected to client');

    if (recentRoom >= 0
        && appListener.sockets.adapter.rooms["Room" + recentRoom] != null
        && appListener.sockets.adapter.rooms["Room" + recentRoom].length == 1) {
        connect_sem.take(function() {
            room_to_join = "Room" + recentRoom;
            socket.join(room_to_join);
            socket.room = room_to_join;
            console.log(room_to_join);
            recentRoom = -1;
            connect_sem.leave();
        });
    } else {
        connect_sem.take(function() {
            room_to_join = "Room" + nextRoom;
            socket.join(room_to_join);
            socket.room = room_to_join;
            console.log(room_to_join);
            recentRoom = nextRoom;
            nextRoom++;
            connect_sem.leave();
        });

        socket.emit('freeze_start');
    }


    // socket.on('am_I_second_to_join', function() {
    // 	if (io.sockets.adapter.rooms[socket.room].length == 1) {
    // 		socket.emit('freeze_start');
    // 	} else {
    // 		socket.to(socket.room).emit('unfreeze_start');
    // 	}
    // });

    socket.on('enable_blocks_for_player_2', function(data) {
        socket.to(socket.room).emit('enable_blocks_for_player_2', data);
    });

    socket.on('Update_score', function(data) {
        socket.to(socket.room).emit('Update_score', data);
    });

    socket.on('disable_blocks_for_player_2', function() {
        socket.to(socket.room).emit('disable_blocks_for_player_2');
    });

    socket.on('receive_position', function(data) {
        socket.to(socket.room).emit('update_position', data);
    });

    socket.on('receive_flip_block', function(block_id) {
        console.log(block_id);
        socket.to(socket.room).emit('update_flip_block', block_id);
    });

    socket.on('receive_movement_data', function(data) {
        socket.to(socket.room).emit('update_movement_data', data);
    });

    socket.on('receive_gesture_data', function(data) {
        socket.to(socket.room).emit('update_gesture_data', data);
    });

    socket.on('receive_user_message', function(message) {
        appListener.to(socket.room).emit('update_user_message', message);
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
        console.log(data);
        socket.to(socket.room).emit('end_game_for_user', data);
    });

    socket.on('disconnect', function() {

        if (going_to_surveys.get(socket.room) == null) {
            appListener.to(socket.room).emit('user_left_game');
            going_to_surveys.set(socket.room, null);
        }

        starting_game_data.set(socket.room, null);
        voice_connection_data.set(socket.room, null);
    });

    socket.on('setInitialPosition', function(data) {
        if (starting_game_data.get(socket.room) == null) {
            init_sem.take(function() {
                console.log("Setting the initial game data for " + socket.room);
                starting_game_data.set(socket.room, data);
                init_sem.leave();
            });
        } else {
            init_sem.take(function() {
                console.log("Sharing data with " + socket.room);
                init_sem.leave();
            });
            socket.emit('setInitialPosition', starting_game_data.get(socket.room));
            socket.to(socket.room).emit('unfreeze_start');
        }

    });

    // All movements of blocks are recorded with their percentage position relative to the table/container.
    // All gestures are recorded with their percentage position relative the the entire screen.
    // All flips are recorded with their pixel position. (Position isn't totally necessary here due to the id also being included.)

    socket.on('send_data_to_server', function(data) {
        console.log('Getting data');
        console.log(data);

        // console.log([data.time, data.task, data.b, data.W, data.G, data.bm,
        //              data.br, data.pn, data.pp, data.te, data.ie, data.p,
        //              data.Action, data.initialInfo, data.other, data.finalScore,
        //              data.standard_info]);

        var query = client.query("INSERT INTO ibmdb(Time, Task, b, W, G, bm, br, pn, pp, te, ie, p, TimeAndLocation, InitialInfo, SearchWords, finalScore, standard_info) values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)", [data.time, data.task, data.b, data.W, data.G, data.bm, data.br, data.pn, data.pp, data.te, data.ie, data.p, data.Action, data.initialInfo, data.other, data.finalScore, data.standard_info]);

        // console.log(query);

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

console.log('End of app_io thing');


var game_password = "password";
// var verify_app = https.createServer(config.serverOptions);
var verify_app = https.createServer();
var verify_listener = io.listen(verify_app);
verify_app.listen(config.surveyPort, config.surveyPort);

console.log('verify_io thing');
verify_listener.on("connection", function(socket) {
    socket.on("verify_login", function(password) {
        if (password === game_password) {
            socket.emit("verify_login", true);
        } else {
            socket.emit("verify_login", false);
        }
    });
});
console.log('End of verify_io thing');

function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }

    return false;
}
