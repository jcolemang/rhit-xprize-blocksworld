let movesCorrector = new function () {
    let undoMove;
    let incorrect_button = $("#buttonIncorrect");

    incorrect_button.prop("disabled", true);

    this.handle_incorrect_move = function () {
        this.disable_incorrect_button();
        run_undo_move();
    }

    function run_undo_move() {
        if (undoMove !== undefined) {
            update_position(undoMove);
            update_score(undoMove);
            undoMove = undefined;
        }
    }

    this.disable_incorrect_button = function () {
        incorrect_button.prop("disabled", true);
    }

    this.enable_incorrect_button = function () {
        incorrect_button.prop("disabled", false);
    }

    this.update_undo_move = function (moveData) {
        let block = $("#" + moveData.block_id);

        undoMove = {
            block_id: moveData.block_id,
            left: block.prop("style")["left"].slice(0, -1),
            top: block.prop("style")["top"].slice(0, -1)
        };
    }
};
