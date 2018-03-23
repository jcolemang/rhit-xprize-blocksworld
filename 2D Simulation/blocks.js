let blocks = new function () {

    function get_block(id) {
        return $("#block" + id);
    }

    this.set_block_text = function (id, text) {
        get_block(id).html("<span style=\"color: black\">" + text + "</span>");
    };

    this.get_block_text = function (id) {
        return get_block(id).find("span").html();
    }
};
