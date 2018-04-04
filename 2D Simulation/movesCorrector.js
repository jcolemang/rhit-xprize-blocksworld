let movesCorrector = new function () {
    let undo_action;
    let incorrect_button = $("#buttonIncorrect");
    let awaiting_correction = false;
    let handling_ambiguity = false;
    let move;

    incorrect_button.prop("disabled", true);

    this.handle_incorrect_move = function () {
        awaiting_correction = true;

        this.disable_incorrect_button();

        run_undo_action();
        blocks.display_block_ids();
        display_flip_explanation();
    }

    function run_undo_action() {
        if (undo_action === undefined) {
            return;
        }

        if (undo_action.type === "move") {
            update_gui_block(undo_action);
            update_score(undo_action);
        } else if (undo_action.type === "flip") {
            let id = undo_action.block_id.substring(5);

            flipBlock(undo_action.block_id,
                      blocks.get_block_text(id),
                      blocks.get_block_color(id),
                      currentConfig);
        }

        undo_action = undefined;
    }

    function display_ambiguous_move_explanation(move) {
        let color = move['predicted_color'] || 'Ambiguous';
        let letter = move['predicted_letter'] || 'Ambiguous';
        let message = 'I think that this is an ambiguous move. '
            + 'Predicted color: ' + color + '\n'
            + 'Predicted letter: ' + letter + '\n'
            + 'Enter the identifier of the intended block.';
        alert(message);
    };

    function display_flip_explanation() {
        alert("Please enter the id number of the block you wanted to flip.");
    }

    this.disable_incorrect_button = function () {
        incorrect_button.prop("disabled", true);
    };

    this.enable_incorrect_button = function () {
        incorrect_button.prop("disabled", false);
        blocks.display_block_letters();
    };

    this.update_undo_move = function (moveData) {
        let id = Number(moveData.block_id.substring(5));

        undo_action = {
            type: "move",
            block_id: moveData.block_id,
            left: blocks.get_block_left_pos(id),
            top: blocks.get_block_top_pos(id)
        };
    };

    this.update_undo_flip = function (block_id) {
        undo_action = {
            type: "flip",
            block_id: block_id
        };
    };

    function convert_message_to_id_num(message) {
        return Number(message.trim());
    };

    this.handle_message = function (message) {
        if (!awaiting_correction)
            return false;

        let id = convert_message_to_id_num(message);

        if (message !== "" && is_valid_id(id)) {
            flipBlock("block" + id,
                      blocks.get_block_text(id),
                      blocks.get_block_color(id),
                      currentConfig);
            awaiting_correction = false;
            blocks.display_block_letters();
        } else {
            display_flip_explanation();
        }

        return true;
    }

    function is_valid_id(id) {
        return id % 1 === 0 && id >= 0 && id < NumBlocks;
    }

    this.is_handling_ambiguity = function() {
        return handling_ambiguity;
    };

    this.handle_ambiguity = function(currMove) {
        handling_ambiguity = true;
        move = currMove;
        display_ambiguous_move_explanation(move);
        blocks.display_block_ids();
    };

    this.finish_handling_ambiguity = function(message) {
        let id = convert_message_to_id_num(message);

        if (message !== "" && is_valid_id(id)) {

            move.block_id = 'block' + id;

            handling_ambiguity = false;
            blocks.display_block_letters();

            if (move.type == 'ambiguous_move') {
                move.type = 'move';
                update_position(move);
            } else if (move.type == 'ambiguous_flip') {
                move.type = 'flip';
                update_flip_block(move.block_id);
            }
        } else {
            display_ambiguous_move_explanation(move);
        }
    };
};
