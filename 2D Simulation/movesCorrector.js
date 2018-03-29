let movesCorrector = new function () {
    let undo_action;
    let incorrect_button = $("#buttonIncorrect");
    let awaiting_correction = false;

    incorrect_button.prop("disabled", true);

    this.handle_incorrect_move = function () {
        awaiting_correction = true;

        this.disable_incorrect_button();

        run_undo_action();
        display_block_ids();
        display_flip_explanation();
    };

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

    function display_block_ids() {
        for (let i = 0; i < NumBlocks; i++) {
            blocks.set_block_text(i, i);
        }
    }

    function display_flip_explanation() {
        alert("Please enter the id number of the block you wanted to flip.");
    }

    this.disable_incorrect_button = function () {
        incorrect_button.prop("disabled", true);
    };

    this.enable_incorrect_button = function () {
        incorrect_button.prop("disabled", false);
        display_block_letters();
    };

    function display_block_letters() {
        for (let i = 0; i < NumBlocks; i++) {
            blocks.set_block_text(i, currentConfig[i].topLetter);
        }
    }

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

    this.handle_message = function (message) {
        if (!awaiting_correction)
            return false;

        message = message.trim();

        let id = Number(message);

        if (message !== "" && is_valid_id(id)) {
            flipBlock("block" + id,
                      blocks.get_block_text(id),
                      blocks.get_block_color(id),
                      currentConfig);
            awaiting_correction = false;
            display_block_letters();
        } else {
            display_flip_explanation();
        }

        return true;
    };

    function is_valid_id(id) {
        return id % 1 === 0 && id >= 0 && id < NumBlocks;
    }
};
