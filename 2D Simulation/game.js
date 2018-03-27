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

let left_array = [];
let top_array = [];
for (var i = 0; i < NumBlocks; i++) {
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
        configuration: currentConfig
    });
} catch (err) {
    /* window.location.href = "server_down.html";*/
    redirects.pageDown(err);
}

/////////////////////
// IncorrectButton //
/////////////////////

function get_incorrect_button() {
    return $("#buttonIncorrect");
}

function setup_incorrect_button() {
    get_incorrect_button().prop("disabled", true);
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
        update_gui_block(_undoMove);
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

socket.on('update_position', function (moveData) {
    update_undo_move(moveData);
    update_gui_block(moveData);
    enable_incorrect_button();
});

function update_gui_block(moveData) {
    if (this.last_z === undefined) {
        this.last_z = 1;
    }

    let left = Math.max(moveData.left, 0);
    let top = Math.max(moveData.top, 0);
    let block = $("#" + moveData.block_id);

    let old_left = block.css('left');
    let old_top = block.css('top');

    block.css({
        left: left + "%",
        top: top + "%"
    });

    block.css('z-index', ++this.last_z);

    block.data("horizontal_percent", left);
    block.data("vertical_percent", top);

    movesTracker.add_move(moveData.block_id,
                          get_block_letter(moveData.block_id),
                          get_block_color(moveData.block_id),
                          old_left, old_top,
                          left, top);
}

function update_undo_move(moveData) {
    let block = $("#" + moveData.block_id);

    _undoMove = {
        block_id: moveData.block_id,
        left: block.prop("style")["left"].slice(0, -1),
        top: block.prop("style")["top"].slice(0, -1)
    };
}

socket.on('update_flip_block', function (block_id) {
    flipBlock(block_id, get_block_letter(block_id),
              get_block_color(block_id), currentConfig);
    enable_incorrect_button();
});

function get_block_letter(block_id) {
    return blockLetters[Number(block_id.substring(5))];
}

function get_block_color(block_id) {
    return document.getElementById(block_id).style.backgroundColor;
}
socket.on('indicate_impossible_move', function(move) {
    let color = move['predicted_color'];
    let letter = move['predicted_letter'];
    let message = 'I think that this is an impossible move. '
    + 'My prediction is that you are trying to move the '
    + color + ' '
    + letter + '. '
    + 'Please check that this move is possible.';
    alert(message);
});

socket.on('indicate_ambiguous_move', function(move) {
    let color = move['predicted_color'] || 'Ambiguous';
    let letter = move['predicted_letter'] || 'Ambiguous';
    let message = 'I think that this is an ambiguous move. '
    + 'Please try a more specific instruction.\n'
    + 'Predicted color: ' + color + '\n'
    + 'Predicted letter: ' + letter;
    alert(message);
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
                var flipped_block_color = document.getElementById("block" + $(this).data("id")).style.backgroundColor;
                var flipped_block_letter = blockLetters[$(this).data("id")];

                var event = e || window.event;

                flipBlock('block' + $(this).data("id"),
                          flipped_block_letter, flipped_block_color,
                          event, currentConfig);
                send_flip_to_server('block' + $(this).data("id"));
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
                gameState: gameConfig
            });
        } catch (err) {
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
            top: vert
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
