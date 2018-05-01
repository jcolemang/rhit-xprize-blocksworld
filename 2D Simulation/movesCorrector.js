function MovesCorrector() {
    this._awaiting_flip_correction = false;
    this._awaiting_move_correction = false;
    this._undo_action = null;

    this.update_undo_move = function (moveData) {
        this._undo_action = this._create_undo_move(moveData);
    }

    this._create_undo_move = function (moveData) {
        let id = Number(moveData.block_id.substring(5));

        return {
            type: "move",
            block_id: moveData.block_id,
            left: blocks.get_block_left_pos(id),
            top: blocks.get_block_top_pos(id)
        };
    }

    this.update_undo_flip = function (block_id) {
        this._undo_action = this._create_undo_flip(block_id);
    };

    this._create_undo_flip = function (block_id) {
        return {
            type: "flip",
            block_id: block_id
        };
    }

    this.correct_flip = function () {
        this._awaiting_flip_correction = true;
        this._start_correct_action();

        correctionUI.display_flip_explanation();
    };

    this.correct_move = function () {
        this._awaiting_move_correction = true;
        this._start_correct_action();

        correctionUI.display_move_explanation();
    };

    this._start_correct_action = function () {
        correctionUI.hide_corrections_modal();
        correctionUI.disable_incorrect_button();

        this._run_undo_action();

        blocks.display_block_ids();
    };

    this._run_undo_action = function () {
        if (this._undo_action === null) {
            return;
        }

        if (this._undo_action.type === "move") {
            update_gui_block(this._undo_action);
            update_score(this._undo_action);
        } else if (this._undo_action.type === "flip") {
            let id = this._undo_action.block_id.substring(5);

            flipBlock(this._undo_action.block_id,
                      blocks.get_block_text(id),
                      blocks.get_block_color(id),
                      currentConfig);
        }

        this._undo_action = null;
    };

    this.handle_message = function (message) {
        message = message.trim();

        if (this._awaiting_flip_correction) {
            this._handle_flip_message(message);
            return true;
        } else if (this._awaiting_move_correction) {
            this._handle_move_message(message);
            return true;
        } else {
            return false;
        }
    };

    this._handle_flip_message = function (message) {
        let id = Number(message);

        if (message !== "" && this._is_valid_id(id)) {
            flipBlock("block" + id,
                      blocks.get_block_text(id),
                      blocks.get_block_color(id),
                      currentConfig);
            this._awaiting_flip_correction = false;
            blocks.display_block_letters();
        } else {
            correctionUI.display_flip_explanation();
        }
    }

    this._handle_move_message = function (message) {
        let id = Number(message);

        if (message !== "" && this._is_valid_id(id)) {
            let gesture_pos = gesture.get_position();
            let move = {
                left: gesture_pos.left,
                top: gesture_pos.top,
                block_id: "block" + id
            };

            update_gui_block(move);
            gesture.hide();

            this._awaiting_move_correction = false;
            blocks.display_block_letters();
        } else {
            correctionUI.display_move_explanation();
        }
    }

    this._is_valid_id = function (id) {
        return id % 1 === 0 && id >= 0 && id < NumBlocks;
    }
};

if (typeof module !== 'undefined'
    && module.hasOwnProperty('exports')) {
    module.exports = MovesCorrector;
}

let movesCorrector = new MovesCorrector();
