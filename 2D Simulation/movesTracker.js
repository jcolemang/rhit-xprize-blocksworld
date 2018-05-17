function MovesTracker() {
    this.actions = [];

    this.add_gesture = function (left_pos_percent, top_pos_percent) {
        this.actions.push(new _Gesture(left_pos_percent, top_pos_percent));
    };

    this.add_instruction = function (text) {
        this.actions.push(new _Instruction(text));
    };

    this.add_flip = function (id, letter, color, x_pos, y_pos) {
        this.actions.push(new _Flip(id, letter, color, x_pos, y_pos));
    };

    this.add_move = function (id, letter, color,
                              orig_left, orig_top,
                              end_left, end_top) {
        this.actions.push(new _Move(id, letter, color,
                                    orig_left, orig_top,
                                    end_left, end_top));
    };

    this.export_actions = function () {
        return this.actions;
    };
};

function _Gesture(left_pos_percent, top_pos_percent) {
    return {
        type: 'gesture',
        time: getDateTime(),
        left_pos: left_pos_percent,
        top_pos: top_pos_percent
    };
};

function _Instruction(text) {
    return {
        type: 'command',
        time: getDateTime(),
        text: text
    };
};

function _Flip(id, letter, color, x_pos, y_pos) {
    return {
        type: 'flip',
        id: +id.substr(-1),
        time: getDateTime(),
        letter: letter,
        color: color,
        left_pos: x_pos,
        top_pos: y_pos
    };
};

function _Move(id, letter, color, orig_left, orig_top, end_left, end_top) {
    return {
        type: 'movement',
        id: +id.substr(-1),
        time: getDateTime(),
        letter: letter,
        color: color,
        left_pos: +orig_left.slice(0, -2),
        top_pos: +orig_top.slice(0, -2),
        new_left_pos: end_left,
        new_top_pos: end_top
    };
};

if (typeof module !== 'undefined'
    && module.hasOwnProperty('exports')) {
    module.exports = {
        MovesTracker: MovesTracker,
        _Gesture: _Gesture,
        _Instruction: _Instruction,
        _Flip: _Flip,
        _Move: _Move
    };
};

let movesTracker = new MovesTracker();
