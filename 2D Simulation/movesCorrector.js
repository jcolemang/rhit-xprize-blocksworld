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
    }

    function run_undo_action() {
        if (undo_action === undefined) {
            return;
        }

        if (undo_action.type === "move") {
            update_position(undo_action);
        } else if (undo_action.type === "flip") {
            flipBlock(undo_action.block_id, null, currentConfig);
        }

        update_score(undo_action);
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
        hide_block_ids();
    };

    function hide_block_ids() {
        for (let i = 0; i < NumBlocks; i++) {
            blocks.set_block_text(i, currentConfig[i].topLetter);
        }
    }

    this.update_undo_move = function (moveData) {
        let block = $("#" + moveData.block_id);

        undo_action = {
            type: "move",
            block_id: moveData.block_id,
            left: block.prop("style")["left"].slice(0, -1),
            top: block.prop("style")["top"].slice(0, -1)
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

        let id = Number(message);

        if (is_valid_id(id)) {
            flipBlock("block" + id, null, currentConfig);
            awaiting_correction = false;
            hide_block_ids();
        } else {
            display_flip_explanation();
        }

        return true;
    }

    function is_valid_id(id) {
        return id % 1 === 0 && id >= 0 && id < NumBlocks;
    }
};
