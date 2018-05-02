/* globals: end_left, end_top, NumBlocks, initialScore */

function scoreCal(finalBlocks) {
    let goal_left = finalBlocks.map(block => block.left);
    let goal_top = finalBlocks.map(block => block.top);

    let goal_centroid = centroid(goal_left, goal_top);
    let current_centroid = centroid(end_left, end_top);

    let errorX = 0;
    let errorY = 0;

    for (var index = 0; index < NumBlocks; index++) {
        errorX += Math.abs((end_left[index] - current_centroid.x)
                           - (goal_left[index] - goal_centroid.x));
        errorY += Math.abs((end_top[index] - current_centroid.y)
                           - (goal_top[index] - goal_centroid.y));
    }

    var totalError = errorY + errorX;
    var width = $("#container").width();
    var height = $("#container").height();

    var Emax = (height + width - 50) * 5;
    var score = ((Emax - totalError) / Emax) * 100;

    if (initialScore != -1) {
        score = 100 / (100 - initialScore) * (score - initialScore);
        if (score < 0) {
            score = 0;
        }
        return score;
    } else {
        initialScore = score;
        return 0;
    }
}

function calc_errors(end_left, end_top, goal_positions) {
    let curr_centroid = centroid(end_left, end_top);
    let goal_centroid = centroid(goal_positions.map(block => block.left),
                                 goal_positions.map(block => block.top));

    let error = 0;
    for (let i = 0; i < NumBlocks; i++) {
        error += calc_error({ x: end_left[i], y: end_top[i] },
                            { x: goal_positions.left,
                              y: goal_positions.top },
                            curr_centroid, goal_centroid);
    }
}

function calc_error(curr_block, goal_block, curr_centroid, goal_centroid) {
    let error_x = Math.abs((curr_block.x - curr_centroid.x) -
                           (goal_block.x - goal_centroid.x));
    let error_y = Math.abs((curr_block.y - curr_centroid.y) -
                           (goal_block.y - goal_centroid.y));

    return error_x + error_y;
}

function centroid(x, y) {
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
