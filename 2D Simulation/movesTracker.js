function MovesTracker() {
    this.actions = [];

    this.add_gesture = function (left_pos_percent, top_pos_percent) {
        this.actions.push(new _Gesture(left_pos_percent, top_pos_percent));
    }

    this.add_instruction = function (text) {
        this.actions.push(new _Instruction(text));
    }

    this.add_flip = function (id, letter, color, x_pos, y_pos) {
        this.actions.push(new _Flip(id, letter, color, x_pos, y_pos));
    }

    this.add_move = function (id, letter, color,
                              orig_left, orig_top,
                              end_left, end_top) {
        this.actions.push(new _Move(id, letter, color,
                                    orig_left, orig_top,
                                    end_left, end_top));
    }

    this.export_actions = function () {
        let action_strs = [];

        for (let action of this.actions) {
            action_strs.push(action.export_to_string());
        }

        return action_strs;
    }
}

function _Gesture(left_pos_percent, top_pos_percent) {
    this.end_date = getDateTime();
    this.left_pos = left_pos_percent;
    this.top_pos = top_pos_percent;

    this.export_to_string = function () {
        return "Gesture" + " "
            + this.end_date + " "
            + _export_position(this.left_pos, this.top_pos);
    };
}

function _Instruction(text) {
    this.end_date = getDateTime();
    this.text = text;

    this.export_to_string = function () {
        return "Instruction" + " "
            + this.end_date + " "
            + this.text;
    };
}

function _Flip(id, letter, color, x_pos, y_pos) {
    this.id = id;
    this.letter = letter;
    this.color = color;
    this.end_date = getDateTime();
    this.left_pos = x_pos;
    this.top_pos = y_pos;

    this.export_to_string = function () {
        return "Flip" + " "
            + _export_block_action(this) + " "
            + this.end_date + " "
            + _export_position(this.left_pos, this.top_pos);
    }
}

function _Move(id, letter, color, orig_left, orig_top, end_left, end_top) {
    this.id = id;
    this.letter = letter;
    this.color = color;
    this.end_date = getDateTime();
    this.left_pos = orig_left;
    this.top_pos = orig_top;
    this.new_left_pos = end_left;
    this.new_top_pos = end_top;

    this.export_to_string = function () {
        return "Movement" + " "
            + _export_block_action(this) + " "
            + this.end_date + " "
            + _export_position(this.left_pos, this.top_pos) + " "
            + _export_position(this.new_left_pos, this.new_top_pos);
    };
}

function _export_block_action(action) {
    return "Block id: " + action.id + " "
        + "Letter: " + action.letter + " "
        + "Color: " + action.color;
}

function _export_position(left_pos, top_pos) {
    return "(" + left_pos + "," + top_pos + ")";
}

if (typeof module !== 'undefined'
    && module.hasOwnProperty('exports')) {
    module.exports = {
        MovesTracker: MovesTracker,
        _Gesture: _Gesture,
        _Instruction: _Instruction,
        _Flip: _Flip,
        _Move: _Move
    };
}

let movesTracker = new MovesTracker();
