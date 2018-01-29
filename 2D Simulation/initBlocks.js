initTaskID();
blockColors = initColors(color, NumBlocks);
flipColorArray = initColors(color, NumBlocks);
blockLetters = initLetters(letters, NumBlocks);
flipLetterArray = initLetters(letters, NumBlocks);
initBlocks(blockColors, flipColorArray, blockLetters, flipLetterArray);
writeBlockStyle(blockColors);
initInstructions();
setTaskHeader();
setIntroduction(1);
popUpGameIntro();

function initBlocks(bColors, flipColors, bLetters, flipLtrs) {
    console.log('Calling initBlocks');
    // Adds 1 to NumBlocks if the task is matching, ensuring an even
    // number of blocks to be matched.
    if (taskID == 1) {
        if (NumBlocks % 2 != 0) {
            NumBlocks++;
        }
    }
    var container = document.createElement("div");
    container.id = "container";
    container.ondblclick = function(e) {
        var event = e || window.event;

        setGestureWithPosition(event.clientX, event.clientY, event);
    };
    container.style.fontSize = "4vmin";
    document.body.appendChild(container);
    var position_x = [];
    var position_y = [];
    var cur = 0;
    for (var i = 0; i < NumBlocks; i++) {
        var color_x = bColors[i];
        var l = Math.floor(Math.random() * bLetters.length);

        let horizNum = document.getElementById('container').getBoundingClientRect().right - 50 - 8 - 4 - 4;
        let horizDenom = document.getElementById('container').getBoundingClientRect().right * 100;
        var horizontal_percent = horizNum / horizDenom;

        let vertNum = document.getElementById('container').getBoundingClientRect().bottom - 50 - 8 - 4 - 4;
        let vertDenom = document.getElementById('container').getBoundingClientRect().bottom * 100;
        var vertical_percent = vertNum / vertDenom;

        let tLeft = Math.random() * Math.floor(horizontal_percent);
        let tTop = Math.random() * Math.floor(vertical_percent);

        if (i < bLetters.length) {
            l = i;
        }

        $("#container").append("<div class = \"block\" id =\"block"+i+"\" style=\"left: " + tLeft + "%; top: " + tTop + "%; background-color: " + color_x + "\"></div>");

        $("#block" + i).append("<span style=\"color: black\">" + bLetters[l] + "<span>");

        standard_info.push("block:" + i + " " + "standard position: (" + tLeft + "%, " + tTop + "%) color: " + color_x + " letters: " + bLetters[l] + " flipletters: " + flipLtrs[l]);
        goal_top.push(tTop);
        goal_left.push(tLeft);

        $("#block" + i).data("id", i);
        $("#block" + i).data("horizontal_percent", tLeft);
        $("#block" + i).data("vertical_percent", tTop);

        $("#block" + i).bind("contextmenu", function(e) {
            if (!((taskID == 3 || taskID == 0) && am_i_player1)) {
                var event = e || window.event;
                flipBlock('block' + $(this).data("id"), event, bLetters, bColors);
                send_flip_to_server('block' + $(this).data("id"));
                if (am_i_player1) {
                    players.push("Human");
                } else {
                    players.push("Robot");
                }

                var flipped_block_color = document.getElementById("block" + $(this).data("id")).style.backgroundColor;
                var flipped_block_letter = blockLetters[$(this).data("id")];

                block_actions.push("Block id: " + $(this).data("id") + " " + "Letter: " + flipped_block_letter + " " + "Color: " + flipped_block_color);
            }
        });
    }
}
