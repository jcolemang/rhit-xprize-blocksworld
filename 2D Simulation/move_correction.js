let _undoMove;

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
        update_position(_undoMove);
        update_score(_undoMove);
        _undoMove = undefined;
    }
}

function update_undo_move(moveData) {
    let block = $("#" + moveData.block_id);

    _undoMove = {
        block_id: moveData.block_id,
        left: block.prop("style")["left"].slice(0, -1),
        top: block.prop("style")["top"].slice(0, -1)
    };
}

setup_incorrect_button();
