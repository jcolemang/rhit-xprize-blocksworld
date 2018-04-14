var socket;

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
    socket.emit('setInitialPosition');
} catch (err) {
    redirects.pageDown(err);
}

socket.on('freeze_start', function() {
    var startButton = document.getElementById('buttonStart');
    var endButton = document.getElementById('buttonEnd');
    var enterButton = document.getElementById('buttonEnter');

    startButton.disabled = true;
    endButton.disabled = true;
    enterButton.disabled = true;

    document.getElementById('disablingDiv').style.display = 'block';
    document.getElementById('txt_instruction').disabled = true;
    document.getElementById('container').ondblclick = function(e) {
        // Do nothing;
    };
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

    alert('You have successfully connected to the game server. You may now press the start button to begin.');
});

socket.on('update_position', function (moveData) {
    movesCorrector.update_undo_move(moveData);
    update_gui_block(moveData);
    correctionUI.enable_incorrect_button();
});

function update_gui_block(moveData) {
    if (this.last_z === undefined) {
        this.last_z = 1;
    }

    let left = Math.max(moveData.left, 0);
    let top = Math.max(moveData.top, 0);

    let block = $("#" + moveData.block_id);
    let id = moveData.block_id.substring(5);

    let old_left = block.css('left');
    let old_top = block.css('top');

    block.css({
        left: left + "%",
        top: top + "%"
    });

    movesTracker.add_move(moveData.block_id,
                          blocks.get_block_text(id),
                          blocks.get_block_color(id),
                          old_left, old_top,
                          left, top);
}

socket.on('update_flip_block', function (block_id) {
    let id = block_id.substring(5);

    movesCorrector.update_undo_flip(block_id);
    flipBlock(block_id, blocks.get_block_text(id),
              blocks.get_block_color(id), currentConfig);
    correctionUI.enable_incorrect_button();
});

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

function send_flip_to_server(block_id) {
    try {
        socket.emit('receive_flip_block', block_id);
    } catch (err) {
        /* window.location.href = "server_down.html";*/
        redirects.pageDown(err);
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
    let message = document.getElementById("txt_instruction").value;

    if (start_button_pressed) {
        if (movesCorrector.handle_message(message)) {
            return;
        }

        if (gesture_is_visible()) {
            gestureCount++;
            send_gesture_to_server();
        }

        try {
            socket.emit('receive_user_message', {
                text: message,
                gameState: gameConfig
            });
        } catch (err) {
            redirects.pageDown(err);
        }

        correctionUI.disable_incorrect_button();
    }
}

function gesture_is_visible() {
    gestureElement = $('#gestureToggle')
    return gestureElement.is(':visible')
}

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

function get_gesture_position() {
    let rect = document.getElementById('container').getBoundingClientRect();
    let gesture = $("#gestureToggle");

    return {
        left: ((gesture.position().left - rect.left) / (rect.right - rect.left - 16)) * 100,
        top: ((gesture.position().top - rect.top) / (rect.bottom - rect.top - 16)) * 100
    };
}

function hide_gesture() {
    $("#gestureToggle").css("visibility", "hidden");
}

function send_gesture_to_server() {
    let gesture_pos = get_gesture_position();

    try {
        socket.emit('receive_gesture_data', {
            left: gesture_pos.left,
            top: gesture_pos.top
        });
    } catch (err) {
        /* window.location.href = "server_down.html";*/
        redirects.pageDown(err);
    }

}

socket.on('user_left_game', function() {
    window.location.href = "finalPage.html";
});
// Opens the popup window for communication between clients.
// window.open('Live Audio.html', 'newwindow', 'width=500, height=450');
