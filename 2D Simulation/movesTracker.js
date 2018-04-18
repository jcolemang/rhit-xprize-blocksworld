let movesTracker = new function () {
    this.actions = [];

    this.add_gesture = function (start_time, left_pos_percent, top_pos_percent) {
        this.actions.push({
            type: 'gesture',
            time: (new Date().getTime() - start_time)/1000,
            left_pos: +left_pos_percent.slice(0, -1),
            top_pos: +top_pos_percent.slice(0, -1)
        });
    };

    this.add_instruction = function (start_date, start_time, text) {
        this.actions.push({
            type: 'command',
            time: (new Date().getTime() - start_time)/1000,
            text: text
        });
    };

    this.add_flip = function (id, start_time, letter, color, x_pos, y_pos) {
        this.actions.push({
            type: 'flip',
            id: +id.substr(-1),
            time: (new Date().getTime() - start_time),
            letter: letter,
            color: color,
            left_pos: x_pos,
            top_pos: y_pos
        });
    };

    this.add_move = function (id, start_time, letter, color,
                              orig_left, orig_top,
                              end_left, end_top) {
        this.actions.push({
            type: 'movement',
            id: +id.substr(-1),
            time: (new Date().getTime() - start_time),
            letter: letter,
            color: color,
            left_pos: +orig_left.slice(0, -2),
            top_pos: +orig_top.slice(0, -2),
            new_left_pos: end_left,
            new_top_pos: end_top
        });
    };

    this.export_actions = function () {
        return this.actions;
    };
};
