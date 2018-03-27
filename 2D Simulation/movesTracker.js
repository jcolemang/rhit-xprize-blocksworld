let movesTracker = new function () {
    this.actions = [];

    this.add_gesture = function (left_pos_percent, top_pos_percent) {
        this.actions.push({
            end_date: getDateTime(),
            left_pos: left_pos_percent,
            top_pos: top_pos_percent,
            export_func: export_gesture
        });
    }

    function export_gesture(action) {
        return "Gesture" + " "
            + action.end_date + " "
            + export_position(action.left_pos, action.top_pos);
    }

    this.add_instruction = function (start_date, start_time, text) {
        this.actions.push({
            start_date: start_date,
            end_date: getDateTime(),
            interval: new Date().getTime() - start_time,
            text: text,
            export_func: export_instruction
        });
    }

    function export_instruction(action) {
        return "Instruction" + " "
            + action.start_date + " "
            + action.end_date + " "
            + action.interval + " "
            + action.text;
    }

    this.add_flip = function (id, letter, color, x_pos, y_pos) {
        this.actions.push({
            id: id,
            letter: letter,
            color: color,
            end_date: getDateTime(),
            left_pos: x_pos,
            top_pos: y_pos,
            export_func: export_flip
        });
    }

    function export_flip(action) {
        return "Flip" + " "
            + export_block_action(action) + " "
            + action.end_date + " "
            + export_position(action.left_pos, action.top_pos);
    }

    this.add_move = function (id, letter, color,
                              orig_left, orig_top,
                              end_left, end_top) {
        this.actions.push({
            id: id,
            letter: letter,
            color: color,
            end_date: getDateTime(),
            left_pos: orig_left,
            top_pos: orig_top,
            new_left_pos: end_left,
            new_top_pos: end_top,
            export_func: export_move
        });
    }

    function export_move(action) {
        return "Movement" + " "
            + export_block_action(action) + " "
            + action.end_date + " "
            + export_position(action.left_pos, action.top_pos) + " "
            + export_position(action.new_left_pos, action.new_top_pos);
    }

    function export_position(left_pos, top_pos) {
        return "(" + left_pos + "," + top_pos + ")";
    }

    function export_block_action(action) {
        return "Block id: " + action.id + " "
            + "Letter: " + action.letter + " "
            + "Color: " + action.color;
    }

    this.export_actions = function () {
        let action_strs = [];

        for (let action of this.actions) {
            action_strs.push(action.export_func(action));
        }

        return action_strs;
    }
}
