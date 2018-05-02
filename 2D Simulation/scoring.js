/* uses global variables: end_left, end_top, NumBlocks */

function Scoring() {
    this.initialScore = null;

    this.calc_score = function (finalBlocks) {
        let error = this._calc_total_error(end_left, end_top, finalBlocks);
        let raw_score = this._calc_score(error);

        return this._update_initial_score(raw_score);
    }

    this._calc_total_error = function (end_left, end_top, goal_positions) {
        let curr_centroid = this._centroid(end_left, end_top);
        let goal_centroid = this._centroid(goal_positions.map(block => block.left),
                                           goal_positions.map(block => block.top));

        let error = 0;
        for (let i = 0; i < NumBlocks; i++) {
            let curr_block = {
                x: end_left[i],
                y: end_top[i]
            };
            let goal_block = {
                x: goal_positions[i].left,
                y: goal_positions[i].top
            };

            error += this._calc_error(curr_block, goal_block,
                                     curr_centroid, goal_centroid);
        }

        return error;
    }

    this._calc_error = function (curr_block, goal_block, curr_centroid, goal_centroid) {
        let error_x = Math.abs((curr_block.x - curr_centroid.x) -
                               (goal_block.x - goal_centroid.x));
        let error_y = Math.abs((curr_block.y - curr_centroid.y) -
                               (goal_block.y - goal_centroid.y));

        return error_x + error_y;
    }

    this._centroid = function (x, y) {
        let centerX = 0;
        let centerY = 0;

        for (var i = 0; i < x.length; i++) {
            centerX += x[i];
            centerY += y[i];
        }

        return {
            x: centerX /= x.length,
            y: centerY /= y.length
        };
    }

    this._calc_score = function (error) {
        let container = $("#container");

        let width = container.width();
        let height = container.height();

        let Emax = (height + width - 50) * 5;

        return  ((Emax - error) / Emax) * 100;
    }

    this._update_initial_score = function (raw_score) {
        if (this.initialScore !== null) {
            raw_score = 100 / (100 - this.initialScore)
                * (raw_score - this.initialScore);

            if (raw_score < 0) {
                raw_score = 0;
            }

            return raw_score;
        } else {
            this.initialScore = raw_score;

            return 0;
        }
    }
}

let scoring = new Scoring();
