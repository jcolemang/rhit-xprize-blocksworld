function Gesture() {
    this._get_gesture = function () {
        return $('#gestureToggle');
    }

    this.is_visible = function () {
        return this._get_gesture().is(':visible');
    };

    this.show = function () {
        this._get_gesture().css("visibility", "visible");
    }

    this.hide = function () {
        this._get_gesture().css("visibility", "hidden");
    };

    this.get_position = function () {
        let rect = document.getElementById('container').getBoundingClientRect();

        return {
            left: ((this._get_gesture().position().left - rect.left)
                   / (rect.right - rect.left - 16)) * 100,
            top: ((this._get_gesture().position().top - rect.top)
                  / (rect.bottom - rect.top - 16)) * 100
        };
    };

    this.set_position_from_event = function (left, top, event) {
        let rect = document.getElementById('container').getBoundingClientRect();

        if (event == null) {
            let px_left = rect.left + ((rect.right - rect.left - 16) * (left / 100));
            let px_top = rect.top + ((rect.bottom - rect.top - 16) * (top / 100));

            this._set_position((px_left / $(window).width() * 100) + "%",
                               (px_top / $(window).height() * 100) + "%");
        } else {
            this._set_position((left / $(window).width() * 100) + "%",
                               (top / $(window).height() * 100) + "%");
        }

        this.show();

        if (event != null) {
            movesTracker.add_gesture(this._get_gesture().css("left"),
                                     this._get_gesture().css("top"));
        }
    };

    this._set_position = function (left, top) {
        this._get_gesture().css("left", left);
        this._get_gesture().css("top", top);
    }
}

let gesture = new Gesture();
