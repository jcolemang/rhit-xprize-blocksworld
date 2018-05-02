/* All references to id's are just a number. No strings allowed! */
let blocks = new function () {
    function get_block(id) {
        let block = $("#block" + id);

        if (block.length !== 0)
            return block;
        else
            throw "No block found.";
    }

    this.set_block_text = function (id, text) {
        get_block(id).html("<span style=\"color: black\">" + text + "</span>");
    };

    this.get_block_text = function (id) {
        if (currentConfig[id] !== undefined)
            return currentConfig[id].topLetter;
        else
            return "";
    };

    this.get_block_left_pos = function (id) {
        try {
            return Number(get_block(id).prop("style")["left"].replace('%', ''));
        } catch (exception) {
            return undefined;
        }
    };

    this.get_block_top_pos = function (id) {
        try {
            return Number(get_block(id).prop("style")["top"].replace('%', ''));
        } catch (exception) {
            return undefined;
        }
    };

    this.get_block_pos = function (id) {
        return {
            left: this.get_block_left_pos(id),
            top: this.get_block_top_pos(id)
        };
    }

    this.set_block_color = function (id, color) {
        get_block(id).css("background-color", color);
    };

    this.get_block_color = function (id) {
        if (currentConfig[id] !== undefined)
            return currentConfig[id].topColor;
        else
            return "";
    };

    this.flip_block = function (id) {
        this._swap_color(id);
        this._swap_letter(id);
    };

    this._swap_color = function (id) {
        let oldColor = this.get_block_color(id);
        let newColor = currentConfig[id].bottomColor;

        this.set_block_color(id, newColor);

        currentConfig[id].topColor = newColor;
        currentConfig[id].bottomColor = oldColor;
    };

    this._swap_letter = function (id) {
        let oldLetter = this.get_block_text(id);
        let newLetter = currentConfig[id].bottomLetter;

        this.set_block_text(id, newLetter);

        currentConfig[id].topLetter = newLetter;
        currentConfig[id].bottomLetter = oldLetter;
    };

    this.display_block_ids = function () {
        for (let i = 0; i < NumBlocks; i++) {
            blocks.set_block_text(i, i);
        }
    };

    this.display_block_letters = function () {
        for (let i = 0; i < NumBlocks; i++) {
            blocks.set_block_text(i, currentConfig[i].topLetter);
        }
    };
};

if (typeof module !== 'undefined'
    && module.hasOwnProperty('exports')) {
    module.exports = blocks;
}
