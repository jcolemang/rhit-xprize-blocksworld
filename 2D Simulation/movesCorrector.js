let movesCorrector = new function () {
    let undo_move;
    let incorrect_button = $("#buttonIncorrect");

    incorrect_button.prop("disabled", true);

    this.handle_incorrect_move = function () {
        this.disable_incorrect_button();
        run_undo_move();
        display_block_ids();
    }

    function run_undo_move() {
        if (undo_move !== undefined) {
            update_position(undo_move);
            update_score(undo_move);
            undo_move = undefined;
        }
    }

    function display_block_ids() {
        for (let i = 0; i < NumBlocks; i++) {
            blocks.set_block_text(i, i);
        }
    }

    this.disable_incorrect_button = function () {
        incorrect_button.prop("disabled", true);
    }

    this.enable_incorrect_button = function () {
        incorrect_button.prop("disabled", false);
        hide_block_ids();
    }

    function hide_block_ids() {
        for (let i = 0; i < NumBlocks; i++) {
            blocks.set_block_text(i, blockLetters[i]);
        }
    };

    this.update_undo_move = function (moveData) {
        let block = $("#" + moveData.block_id);

        undo_move = {
            block_id: moveData.block_id,
            left: block.prop("style")["left"].slice(0, -1),
            top: block.prop("style")["top"].slice(0, -1)
        };
    }
};
