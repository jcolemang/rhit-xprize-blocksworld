/* uses global variables: NumBlocks */

function Scoring() {
    this.initialScore = null;

    this.calc_score = function (finalBlocks) {
        let error = this._calc_total_error(finalBlocks);
        let raw_score = this._calc_score(error);

        return this._update_initial_score(raw_score);
    }

    this._calc_total_error = function (goal_positions) {
        let curr_centroid = this._make_current_centroid();
        let goal_centroid = this._centroid(goal_positions);

        let error = 0;
        for (let i = 0; i < NumBlocks; i++) {
            let curr_block = blocks.get_block_pos(i);
            let goal_block = goal_positions[i];

            error += this._calc_error(curr_block, goal_block,
                                      curr_centroid, goal_centroid);
        }

        return error;
    };

    this._make_current_centroid = function () {
        let block_list = [];

        for (let i = 0; i < NumBlocks; i++) {
            block_list.push(blocks.get_block_pos(i));
        }

        return this._centroid(block_list);
    }

    this._calc_error = function (curr_block, goal_block, curr_centroid, goal_centroid) {
        let error_x = Math.abs((curr_block.left - curr_centroid.left) -
                               (goal_block.left - goal_centroid.left));
        let error_y = Math.abs((curr_block.top - curr_centroid.top) -
                               (goal_block.top - goal_centroid.top));

        return error_x + error_y;
    }

    this._centroid = function (blocks) {
        let centerX = 0;
        let centerY = 0;

        for (var i = 0; i < blocks.length; i++) {
            centerX += blocks[i].left;
            centerY += blocks[i].top;
        }

        return {
            left: centerX /= blocks.length,
            top: centerY /= blocks.length
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
