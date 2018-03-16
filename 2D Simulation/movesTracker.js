let movesTracker = new function () {
    this.start = [];
    this.end = [];
    this.types = [];
    this.interval = [];
    this.movement_startpos = [];
    this.movement_endpos = [];
    this.instructions = [];
    this.GF_position = [];
    this.time_GF = [];
    this.block_actions = [];

    /* Type is one of: {"Flip", "Gesture", "Instructions"} */
    this.add_type = function (type) {
        this.types.push(type);
    }

    /* Id is of the form: block<id> */
    this.add_block_action = function (id, letter, color) {
        this.block_actions.push("Block id: " + id
                                + " Letter: " + letter
                                + " Color: " + color);
    }

    this.add_gesture = function (left_pos_percent, top_pos_percent) {
        this.add_type("Gesture");
        this.time_GF.push(getDateTime());
        this.GF_position.push("(" + left_pos_percent + "%,"
                              + top_pos_percent + "%)");
    }

    this.add_instruction = function (start_date, start_time, text) {
        this.add_type("Instructions");
        this.start.push(start_date);
        this.end.push(getDateTime());
        this.interval.push(new Date().getTime() - start_time);
        this.instructions.push(text);
    }

    this.add_flip = function (x_pos, y_pos) {
        this.add_type("Flip");
        this.time_GF.push(getDateTime());
        this.GF_position.push("(" + x_pos + ","
                              + y_pos + ")");
    }

    this.add_move = function (start_date, start_time,
                              orig_left, orig_top,
                              end_left, end_top) {
        this.add_type("Movement");

        this.start.push(start_date);
        this.end.push(getDateTime());
        this.interval.push(new Date().getTime() - start_time);

        this.movement_startpos.push("(" + orig_left + "," + orig_top + ")");
        this.movement_endpos.push("(" + end_left + "," + end_top + ")");
    }
}
