var socket;
let _undoMove;

try {
    socket = io.connect(config.appAddr);

    socket.on('connect_failed', function() {
        /* window.location.href = "server_down.html";*/
        redirects.pageDown('connect_failed');
    });

    socket.on('disconnect', function() {
        if (!ending_survey) {
            /* window.location.href = "server_down.html";*/
            redirects.pageDown('disconnect');
        }
    });
} catch (err) {
    redirects.pageDown(err);
}

// alert("If your partner does not connect within 30 to 60 seconds of you receiving this prompt, please refresh the page and try reconnecting to the server.");

// I think this code needs to be here to make the overall application work.
// However, if testing on localhost, comment this section out so it
// doesn't redirect you to the server down page.
/* if (!socket.connected) {
 *   setTimeout(function() {
 *     if (!socket.connected) {
 *       console.log('Garbage timeout');
 *       redirects.pageDown('socket could not connect');
 *     }
 *   }, 3000);
 * }
 */

var left_array = [];
var top_array = [];
for (var i = 0; i < NumBlocks; i++) {
    // var position = $("#block" + i).position();
    /* var current_color = document.getElementById("block" + i).style.backgroundColor;*/
    let current_color = blockColors[i];
    let current_letter = blockLetters[i];
    left_array.push($("#block" + i).data("horizontal_percent"));
    top_array.push($("#block" + i).data("vertical_percent"));
}

try {
    socket.emit('setInitialPosition', {
        numBlocks: NumBlocks,
        lefts: left_array,
        tops: top_array,
        colors: blockColors,
        flipColorArray: flipColorArray,
        letters: blockLetters,
        flipLetterArray: flipLetterArray,
        currentTask: taskID,
        movement_count: actualMove,
        gesture_count: gestureCount,
        ins : specificIns,
        configuration: currentConfig,
        gameType: getGameType()
    });
} catch (err) {
    /* window.location.href = "server_down.html";*/
    redirects.pageDown(err);
}

function getGameType() {
    let url = window.location.href
    if (url.indexOf("?type=ai") !== -1) {
        return "ai";
    } else if (url.indexOf("?type=human") !== -1) {
        return "human";
    } else {
        return "";
    }
}

/////////////////////
// IncorrectButton //
/////////////////////

function get_incorrect_button() {
    return $("#buttonIncorrect");
}

function setup_incorrect_button() {
    let incorrect_button = get_incorrect_button();

    if (getGameType() === "human") {
        incorrect_button.hide();
    }

    incorrect_button.prop("disabled", true);
}

function handle_incorrect_move() {
    disable_incorrect_button();
    run_undo_move();
}

function disable_incorrect_button() {
    get_incorrect_button().prop("disabled", true);
}

function enable_incorrect_button() {
    get_incorrect_button().prop("disabled", false);
}

function run_undo_move() {
    if (_undoMove !== undefined) {
        update_position(_undoMove);
        update_score(_undoMove);
        _undoMove = undefined;
    }
}

setup_incorrect_button();


////////////////////////
// SocketIO callbacks //
////////////////////////

socket.on('freeze_start', function() {
    var startButton = document.getElementById('buttonStart');
    var endButton = document.getElementById('buttonEnd');
    var enterButton = document.getElementById('buttonEnter');

    document.getElementById("chatBox").innerHTML = "Please wait while another player attempts to connect to your game.";

    startButton.disabled = true;
    endButton.disabled = true;
    enterButton.disabled = true;

    document.getElementById('disablingDiv').style.display = 'block';
    // document.getElementById('freeze').style.visibility = 'visible';

    document.getElementById('txt_instruction').disabled = true;

    document.getElementById('container').ondblclick = function(e) {
        // Do nothing;
    };

    for (var i = 0; i < NumBlocks; i++) {
        flip_on = false;

        $("#block" + i).draggable("disable");
    }
});

socket.on('unfreeze_start', function() {

    try {
        socket.emit('disable_blocks_for_player_2');
    } catch (err) {
        /* window.location.href = "server_down.html";*/
        redirects.pageDown(err);
    }

    document.getElementById("disablingDiv").style.display = 'none';

    var startButton = document.getElementById('buttonStart');
    startButton.disabled = false;

    document.getElementById('disablingDiv').style.display = "none";

    alert('Another player has joined the game. You may now press the start button to begin.');
});

socket.on('disable_blocks_for_player_2', function() {
    for (var i = 0; i < NumBlocks; i++) {
        flip_on = false;
        $("#block" + i).draggable("disable");
    }
});

socket.on('enable_blocks_for_player_2', function(data) {
    timecounter();
    for (var i = 0; i < NumBlocks; i++) {
        document.getElementById('block' + i).style.top = data.p_top[i]+"%";
        document.getElementById('block' + i).style.left = data.p_left[i]+"%";
        document.getElementById('block' + i).style.visibility = "visible";
        flip_on = true;

        $("#block" + i).draggable("enable");
    }
});

var z = 1;
function update_position(moveData) {
    var left = Math.max(moveData.left, 0);
    var top = Math.max(moveData.top, 0);

    var block = moveData.block_id;
    $("#" + block).css({
        left: left + "%",
        top: top + "%"
    });
    $("#" + block).css('z-index', ++z);
    $("#" + block).data("horizontal_percent", left);
    $("#" + block).data("vertical_percent", top);
}

socket.on('update_position', function (moveData) {
    update_undo_move(moveData);
    update_position(moveData);
    enable_incorrect_button();
});

function update_undo_move(moveData) {
    let block = $("#" + moveData.block_id);

    _undoMove = {
        block_id: moveData.block_id,
        left: block.prop("style")["left"].slice(0, -1),
        top: block.prop("style")["top"].slice(0, -1)
    };
}

socket.on('update_flip_block', function (block_id) {
    flipBlock(block_id, null, currentConfig);
    enable_incorrect_button();
});

socket.on('setInitialPosition', function(data) {
    document.getElementById('user1').innerText = "Player 1";
    document.getElementById('user2').innerText = "Player 2 (You)";
    document.getElementById('user3').innerText = "Player 1";
    document.getElementById('user4').innerText = "Player 2 (You)";
    am_i_player1 = false;

    var container = document.getElementById("container");
    human_voice = false;

    currentConfig = data.configuration;
    blockColors = data.colors;
    blockLetters = data.letters;
    flipColorArray = data.flipColorArray;
    flipLetterArray = data.flipLetterArray;

    NumBlocks = data.numBlocks;
    taskID = data.currentTask;
    actualMove = data.movement_count;
    gestureCount = data.gesture_count;
    specificIns = " Wait for instructions.";

    if (taskID == 1) {
        document.getElementById('user1').style.visibility = "hidden";
        document.getElementById('user2').style.visibility = "hidden";

        document.getElementById('vertical-line').style.visibility = "visible";
        document.getElementById('vertical-line2').style.visibility = "visible";
        document.getElementById('user3').style.visibility = "visible";
        document.getElementById('user4').style.visibility = "visible";
    }
    if (taskID == 2 || taskID == 0) {
        document.getElementById('vertical-line').style.visibility = "hidden";
        document.getElementById('vertical-line2').style.visibility = "hidden";
        document.getElementById('user3').style.visibility = "hidden";
        document.getElementById('user4').style.visibility = "hidden";

        document.getElementById('user1').style.visibility = "hidden";
        document.getElementById('user2').style.visibility = "hidden";
    }
    if (taskID == 3) {
        document.getElementById('user1').style.visibility = "hidden";
        document.getElementById('user2').style.visibility = "hidden";

        document.getElementById('vertical-line').style.visibility = "hidden";
        document.getElementById('vertical-line2').style.visibility = "hidden";
        document.getElementById('user3').style.visibility = "hidden";
        document.getElementById('user4').style.visibility = "hidden";
    }

    setTaskHeader();
    setIntroduction();

    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    for (var i = 0; i < NumBlocks; i++) {
        $("<div class = \"block\" id =\"block"+i+"\" style=\"left:"+data.lefts[i]+"%; top:"+data.tops[i]+"%; background-color: " + blockColors[i] + "\"></div>").appendTo(container);

        $("#block" + i).append("<span style=\"color: black\">" + blockLetters[i] + "</span>");

        $("#block" + i).data("id", i);
        $("#block" + i).data("horizontal_percent", data.lefts[i]);
        $("#block" + i).data("vertical_percent", data.tops[i]);

        document.getElementById('block' + i).style.visibility = "hidden";

        $("#block" + i).bind("contextmenu", function(e) {
            if (taskID != 1) {
                var event = e || window.event;
                flipBlock('block' + $(this).data("id"), event, currentConfig);
                send_flip_to_server('block' + $(this).data("id"));
                if (am_i_player1) {
                    players.push("Human");
                } else {
                    players.push("Robot");
                }

                var flipped_block_color = document.getElementById("block" + $(this).data("id")).style.backgroundColor;
                var flipped_block_letter = blockLetters[$(this).data("id")];

                block_actions.push("Block id: " + $(this).data("id") + " " + "Letter: " + flipped_block_letter + " " + "Color: " + flipped_block_color);
            }
        });
    }



    $( init );
    for (var i = 0; i < NumBlocks; i++) {
        $("#block" + i).draggable("enable");
        document.getElementById("block" + i).style.visibility = "hidden";
    }
    document.getElementById("instruction").style.visibility = "hidden";
    document.getElementById("buttonStart").style.visibility = "hidden";
    document.getElementById("buttonEnd").style.visibility = "hidden";
    document.getElementById("referenceLink").style.visibility = "hidden";
    document.getElementById("showChosen").style.visibility = "hidden";
    document.getElementById("container").ondblclick = function(e) {
        e.preventDefault();
    };
    setIntroduction(2);
});
function send_flip_to_server(block_id) {
    try {
        socket.emit('receive_flip_block', block_id);
    } catch (err) {
        /* window.location.href = "server_down.html";*/
        redirects.pageDown(err);
    }

}
$(document).ready(function() {
    $(".draggable").draggable();

    $('.draggable').each(function(el){
        // var tLeft = Math.floor(Math.random()*(page_width * 0.7)) + 1,
        // tTop  = Math.floor(Math.random()*(page_height * 0.7)) + 1;
        $(el).css({position:'relative', left: $('container').width(), top: $('container').height()});
    });
});
var z = 1;
$( init );
function init() {
    for (var i = 0; i < NumBlocks; i++) {
        $('#block' + i).draggable({containment: '#container', start: function(event, ui) {
            $(this).css('z-index', ++z);
            // var Startpos = $(this).position();
            previous_left[i] = $(this).data("horizontal_percent");
            previous_top[i] = $(this).data("vertical_percent");
            movementstarttime = new Date().getTime();
            movementdate = getDateTime();
        }, stop: function(event, ui) {
            // var Stoppos = $(this).position();

            $("#" + $(this).attr('id')).css({
                left: $(this).data("horizontal_percent") + "%",
                top: $(this).data("vertical_percent") + "%"
            });

            if ($(this).data("horizontal_percent") != previous_left[i] || $(this).data("vertical_percent") != previous_top[i]) {
                start.push(movementdate);
                end.push(getDateTime());
                interval.push(new Date().getTime() - movementstarttime);
                type.push("Movement");
                actualMove++;
                movement_startpos.push("(" + previous_left[i] + "," + previous_top[i] + ")");
                movement_endpos.push("(" + $(this).data("horizontal_percent") + "," + $(this).data("vertical_percent") + ")");
                if (am_i_player1) {
                    players.push("Human");
                } else {
                    players.push("Robot");
                }
                var moved_block_color = document.getElementById("block" + $(this).data("id")).style.backgroundColor;
                var moved_block_letter = blockLetters[$(this).data("id")];

                block_actions.push("Block id: " + $(this).data("id") + " " + "Letter: " + moved_block_letter + " " + "Color: " + moved_block_color);
                end_left[$(this).data("id")] = $(this).data("horizontal_percent")
                end_top[$(this).data("id")] = $(this).data("vertical_percent");

                setMovement();
                send_movement_to_server();

                socket.emit('Update_score', {
                    block_id : "block" + $(this).data("id"),
                    left: $(this).data("horizontal_percent"),
                    top: $(this).data("vertical_percent")
                });

                // document.getElementById("scoreBox").innerText = scoreCal();
            }
        }, drag: function(event, ui) {
            // var coord = $(this).position();
            var block_id = $(this).attr('id');

            var rect = document.getElementById('container').getBoundingClientRect();

            var horiz = $(this).position().left / (rect.right - rect.left - 16) * 100;

            var vert = $(this).position().top / (rect.bottom - rect.top - 16) * 100;

            $(this).data("horizontal_percent", horiz);
            $(this).data("vertical_percent", vert);

            $("#" + block_id).css({
                left: horiz + "%",
                top: vert + "%"
            });


            // When blocks get moved, the position changes from 'percentage' to 'px'.

            try {
                socket.emit('receive_position', {
                    block_id: block_id,
                    left: horiz,
                    top: vert
                });
            } catch (err) {
                /* window.location.href = "server_down.html";*/
                redirects.pageDown(err);
            }

        }
                                  });
    }
}


// Needs to be fixed to account for new percentage based way of calculating position.

function update_score(moveData) {
    // Expecting block_id of the form: block<id>
    let id = Number(moveData.block_id.substring(5));

    end_left[id] = Number(moveData.left);
    end_top[id] = Number(moveData.top);

    document.getElementById('scoreBox').innerText = Math.round(scoreCal(finalBlocks));
}

socket.on('Update_score', update_score);

function send_movement_to_server() {
    try {
        socket.emit('receive_movement_data', actualMove);
    } catch (err) {
        /* window.location.href = "server_down.html";*/
        redirects.pageDown(err);
    }

}
socket.on('update_movement_data', function(data) {
    actualMove = data;
    setMovement();
});
function send_user_message_to_server(gameConfig) {
    if (start_button_pressed) {
        if (gesture_is_visible()) {
            gestureCount++;
            send_gesture_to_server();
        }

        try {
            socket.emit('receive_user_message', {
                text: document.getElementById("txt_instruction").value,
                gameType: getGameType(),
                gameState: gameConfig
            });
        } catch (err) {
            /* window.location.href = "server_down.html";*/
            redirects.pageDown(err);
        }

        disable_incorrect_button();
    }
}

function gesture_is_visible() {
    gestureElement = $('#gestureToggle')
    return gestureElement.is(':visible')
}

socket.on('update_user_message', function(message) {
    document.getElementById("chatBox").innerHTML = document.getElementById("chatBox").innerHTML + "<br>" + message;
});

socket.on('end_game_for_user', function(data) {

    var action = [];

    for (var i = 0; i < data.Action.length; i++) {
        action.push(data.Action[i]);
    }

    isGameEnd = true;

    var x= 0, y= 0, z = 0, counter = 0, user = 0; block_count = 0;
    for (var i = 0; i < type.length;i++) {
        if (type[i] == "Movement") {
            action.push(players[user]+" "+type[i]+" "+block_actions[block_count]+" "+start[counter]+" "+end[counter]+" "+interval[counter] + " " + movement_startpos[x] + " " +movement_endpos[x]);
            x++; counter++; user++; block_count++;
        } else if (type[i] == "Instructions") {
            action.push(type[i]+" "+start[counter]+" "+end[counter]+" "+interval[counter] + " " + instructions[y]);
            y++; counter++;
        } else {
            if (type[i] == "Flip") {
                action.push(players[user]+" "+type[i]+" "+block_actions[block_count]+" "+time_GF[z] + " " + GF_position[z]);
                block_count++;
            } else {
                action.push(players[user]+" "+type[i]+" "+time_GF[z] + " " + GF_position[z]);
            }
            z++; user++;
        }
    }

    var dateYear = [], dayTime = [], dateMonth = [], dateDay = [];
    for (var i = 0; i < action.length; i++) {
        var start_pos = action[i].indexOf('/') - 2;
        var end_pos = start_pos + 10;
        dateDay.push(parseInt(action[i].substring(0, 2)));
        dateMonth.push(parseInt(action[i].substring(3, 5)));
        dateYear.push(parseInt(action[i].substring(6, 10)));
        start_pos = action[i].indexOf('/', end_pos) - 2;
        end_pos = start_pos + 8;
        dayTime.push(action[i].substring(start_pos, end_pos));
    }

    for (var i = 0; i < action.length; i++) {
        for (var j = i + 1; j < action.length; j++) {
            if (dateYear[i] > dateYear[j]) {
                var st = action[i]; action[i] = action[j]; action[j] = st;
                st = dateYear[i]; dateYear[i] = dateYear[j]; dateYear[j] = st;
                st = dateMonth[i]; dateMonth[i] = dateMonth[j]; dateMonth[j] = st;
                st = dateDay[i]; dateDay[i] = dateDay[j]; dateDay[j] = st;
                st = dayTime[i]; dayTime[i] = dayTime[j]; dayTime[j] = st;
            } else if (dateYear[i] == dateYear[j] && dateMonth[i] > dateMonth[j]) {
                var st = action[i]; action[i] = action[j]; action[j] = st;
                st = dateYear[i]; dateYear[i] = dateYear[j]; dateYear[j] = st;
                st = dateMonth[i]; dateMonth[i] = dateMonth[j]; dateMonth[j] = st;
                st = dateDay[i]; dateDay[i] = dateDay[j]; dateDay[j] = st;
                st = dayTime[i]; dayTime[i] = dayTime[j]; dayTime[j] = st;
            } else if (dateYear[i] == dateYear[j] && dateMonth[i] == dateMonth[j] && dateDay[i] < dateDay[j]) {
                var st = action[i]; action[i] = action[j]; action[j] = st;
                st = dateYear[i]; dateYear[i] = dateYear[j]; dateYear[j] = st;
                st = dateMonth[i]; dateMonth[i] = dateMonth[j]; dateMonth[j] = st;
                st = dateDay[i]; dateDay[i] = dateDay[j]; dateDay[j] = st;
                st = dayTime[i]; dayTime[i] = dayTime[j]; dayTime[j] = st;
            } else if (dateYear[i] == dateYear[j] && dateMonth[i] == dateMonth[j] && dateDay[i] == dateDay[j] && dayTime[i] > dayTime[j]) {
                var st = action[i]; action[i] = action[j]; action[j] = st;
                st = dateYear[i]; dateYear[i] = dateYear[j]; dateYear[j] = st;
                st = dateMonth[i]; dateMonth[i] = dateMonth[j]; dateMonth[j] = st;
                st = dateDay[i]; dateDay[i] = dateDay[j]; dateDay[j] = st;
                st = dayTime[i]; dayTime[i] = dayTime[j]; dayTime[j] = st;
            }
        }
    }

    socket.emit('send_data_to_server', {
        time: data.time,
        task: data.task,
        W: data.W,
        G: data.G,
        b: data.b,
        bm: data.bm,
        br: data.br,
        pn: data.pn,
        pp: data.pp,
        te: data.te,
        ie: data.ie,
        p: data.p,
        finalScore: Math.round(data.finalScore),
        Action: action,
        initialInfo: data.initialInfo,
        standard_info: data.standard_info,
        other: data.other
    });

    alert("You have final score: " + Math.round(data.finalScore));

    ending_survey = true;

    document.body.innerHTML = '';
    document.documentElement.innerHTML = "";

    document.body.innerHTML += "<h2 style=\"font-family:verdana\"> Thank you for participating the game. Please take a few seconds to complete this survey.</h2>	";

    // document.body.innerHTML += "<p id = \"question4\" style=\"font-family:verdana\">1. How helpful did you find your partner?</p>	<input type=\"radio\" name=\"1\" id = \"41\" value=\"1 (not helpful at all)\"> 1 (not helpful at all)	<input type=\"radio\" name=\"1\" id = \"42\" value=\"2\"> 2	<input type=\"radio\" name=\"1\" id = \"43\" value=\"3\"> 3	<input type=\"radio\" name=\"1\" id = \"44\" value=\"4\"> 4	<input type=\"radio\" name=\"1\" id = \"45\" value=\"5\"> 5	<input type=\"radio\" name=\"1\" id = \"46\" value=\"6\"> 6	<input type=\"radio\" name=\"1\" id = \"47\" value=\"7 (very helpful)\"> 7 (very helpful)";
    // document.body.innerHTML += "<p id = \"question5\" style=\"font-family:verdana\">2. How effectively did your partner communicate what the goal was and what you wanted to do? </p>	<input type=\"radio\" name=\"2\" id = \"51\" value=\"1 (very effective)\"> 1 (very effective)	<input type=\"radio\" name=\"2\" id = \"52\" value=\"22\"> 2	<input type=\"radio\" name=\"2\" id = \"53\" value=\"33\"> 3	<input type=\"radio\" name=\"2\" id = \"54\" value=\"44\"> 4	<input type=\"radio\" name=\"2\" id = \"55\" value=\"55\"> 5	<input type=\"radio\" name=\"2\" id = \"56\" value=\"66\"> 6	<input type=\"radio\" name=\"2\" id = \"57\" value=\"7 (not effective at all)\"> 7 (not effective at all)";
    document.body.innerHTML += "<p id = \"question3\" style=\"font-family:verdana\">1. Please provide any feedback you have about the game, or type \"None\" if you don't have any. </p>	<textarea id = \"q3\" rows=\"4\" cols=\"50\"></textarea><br>";
    document.body.innerHTML += "<button class = \"Finishbutton\" style = \"background-image: url(img/startbutton.png); width: 68px; height: 40px;\" onclick=\"submitRobot()\">Submit</button>";
});

function submitRobot() {
    var q3 = "", q4 = -1, q5 = -1;
    q3 = document.getElementById("q3").value;

    document.body.innerHTML += "<p id = \"require\" style = \"font-family:verdana; visibility: hidden;\">Please finish all the questions.</p>";
    if (q3 == "") {
        document.getElementById("question3").style = "width: 1090px; color: red; background-color:rgb(255,204,204);font-family:verdana";
    } else {
        try {
            socket.emit('send_survey_data_to_server', {
                q1: q4,
                q2: q5,
                q3: q3
            });
        } catch (err) {
            /* window.location.href = "server_down.html";*/
            redirects.pageDown(err);
        }
        window.location.href = "finalPage.html";
    }
}



function send_gesture_to_server() {
    var rect = document.getElementById('container').getBoundingClientRect();
    var horiz = (($("#gestureToggle").position().left - rect.left) / (rect.right - rect.left - 16)) * 100;
    var vert = (($("#gestureToggle").position().top - rect.top) / (rect.bottom - rect.top - 16)) * 100;

    try {
        socket.emit('receive_gesture_data', {
            gestureCount: gestureCount,
            left: horiz,
            top: vert,
            gameType: getGameType()
        });
    } catch (err) {
        /* window.location.href = "server_down.html";*/
        redirects.pageDown(err);
    }

}
socket.on('update_gesture_data', function(data) {
    gestureCount = data.gestureCount;
    setGestureWithPosition(data.left, data.top, null);
});
socket.on('user_left_game', function() {
    window.location.href = "finalPage.html";
});
// Opens the popup window for communication between clients.
// window.open('Live Audio.html', 'newwindow', 'width=500, height=450');
