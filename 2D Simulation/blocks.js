let blocks = new function () {
    function get_block(id) {
        return $("#block" + id);
    }

    this.set_block_text = function (id, text) {
        get_block(id).html("<span style=\"color: black\">" + text + "</span>");
    };

    this.get_block_text = function (id) {
        return currentConfig[id].topLetter;
    }

    this.get_block_left_pos = function (id) {
        return get_block(id).prop("style")["left"].slice(0, -1);
    }

    this.get_block_top_pos = function (id) {
        return get_block(id).prop("style")["top"].slice(0, -1);
    }
};
