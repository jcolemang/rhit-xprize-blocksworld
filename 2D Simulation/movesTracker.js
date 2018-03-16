let movesTracker = new function () {
    this.types = [];
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
}
