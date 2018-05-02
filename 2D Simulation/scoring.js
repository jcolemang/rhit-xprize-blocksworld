/* uses global variables: NumBlocks */

function Scoring(blocks, NumBlocks) {
    this._initialScore = null;

    this.calc_score = function (finalBlocks) {
        let error = this._calc_total_error(finalBlocks);
        let raw_score = this._calc_score(error);

        return this._update_initial_score(raw_score);
    }

    this._calc_total_error = function (goal_positions) {
        let block_list = this._make_block_list();

        let curr_centroid = this._centroid(block_list);
        let goal_centroid = this._centroid(goal_positions);

        let error = 0;
        for (let i = 0; i < NumBlocks; i++) {
            let goal_block = goal_positions[i];

            error += this._calc_error(block_list[i], goal_block,
                                      curr_centroid, goal_centroid);
        }

        return error;
    };

    this._make_block_list = function () {
        let block_list = [];

        for (let i = 0; i < NumBlocks; i++) {
            block_list.push(blocks.get_block_pos(i));
        }

        return block_list;
    }

    this._calc_error = function (curr_block, goal_block, curr_centroid, goal_centroid) {
        let error_x = Math.abs((curr_block.left - curr_centroid.left) -
                               (goal_block.left - goal_centroid.left));
        let error_y = Math.abs((curr_block.top - curr_centroid.top) -
                               (goal_block.top - goal_centroid.top));

        return error_x + error_y;
    }

    this._centroid = function (block_list) {
        let centerX = 0;
        let centerY = 0;

        for (var i = 0; i < block_list.length; i++) {
            centerX += block_list[i].left;
            centerY += block_list[i].top;
        }

        return {
            left: centerX /= block_list.length,
            top: centerY /= block_list.length
        };
    }

    this._calc_score = function (error) {
        // the 100's correspond with the width and height (since we're
        // using percentages); besides that I'm not sure where the
        // numbers come from
        let Emax = (100 + 100 - 50) * 5;

        return  ((Emax - error) / Emax) * 100;
    }

    this._update_initial_score = function (raw_score) {
        if (this._initialScore !== null) {
            raw_score = 100 / (100 - this._initialScore)
                * (raw_score - this._initialScore);

            if (raw_score < 0) {
                raw_score = 0;
            }

            return raw_score;
        } else {
            this._initialScore = raw_score;

            return 0;
        }
    }
}

let scoring = new Scoring();
