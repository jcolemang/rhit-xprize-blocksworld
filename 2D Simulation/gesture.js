function Gesture() {
    this._game_position = {
        left: undefined,
        top: undefined
    };

    this._get_parent = function () {
        return $("#main");
    };

    this._get_container = function () {
        return $("#container");
    };

    this._get_gesture = function () {
        return $('#gestureToggle');
    };

    this.is_visible = function () {
        return this._get_gesture().is(':visible');
    };

    this.show = function () {
        this._get_gesture().css("visibility", "visible");
    };

    this.hide = function () {
        this._get_gesture().css("visibility", "hidden");
    };

    this.get_game_position = function () {
        return this._game_position;
    };

    this.set_position = function (left, top) {
        let new_pos = this._absolute_to_main_coords(left, top);

        this._set_percent_position(new_pos);
        this._update_game_coords(new_pos);

        movesTracker.add_gesture(this._game_position.left,
                                 this._game_position.top);

        this.show();
    };

    /* Converts the absolute positions that are passed in to percent
     * positions relative to the main div which surrounds the play
     * area and the sidebar controls. */
    this._absolute_to_main_coords = function (left, top) {
        let parent = this._get_parent();

        let parent_pos = parent.offset();

        let normalized_left = (left - parent_pos.left) / $(parent).width();
        let normalized_top = (top - parent_pos.top) / $(parent).height();

        return {
            left: normalized_left * 100,
            top: normalized_top * 100
        };
    };

    this._set_percent_position = function (percent_pos) {
        this._get_gesture().css("left", percent_pos.left + "%");
        this._get_gesture().css("top", percent_pos.top + "%");
    };

    this._update_game_coords = function (main_pos) {
        let container = this._get_container();
        let container_pos = container.offset();
        let abs_pos = this._get_absolute_position();

        let abs_container_pos = {
            left: abs_pos.left - container_pos.left,
            top: abs_pos.top - container_pos.top
        };

        let normalized_container_pos = {
            left: abs_container_pos.left / container.width(),
            top: abs_container_pos.top / container.height()
        };

        this._game_position = {
            left: normalized_container_pos.left * 100,
            top: normalized_container_pos.top * 100
        };
    };

    this._get_absolute_position = function () {
        return this._get_gesture().offset();
    };
}

let gesture = new Gesture();
