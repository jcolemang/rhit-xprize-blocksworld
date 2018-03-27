var page_width = 0;
var page_height = 0;
var random_multiplier = 10;
var random_addition = 4;
var NumBlocks = Math.floor(Math.random() * random_multiplier) + random_addition;
var Max_Num_Blocks = random_multiplier + random_addition;
var gestureCount = 0;
var NumWords = 0;
var n1 = 1; var n2 = 1;
var actualMove = 0;
var w1 = 0.1, w2 = 0.5;
var previous_top = [];var previous_left = [];
var x;
var y;
var taskID = 0;
var task = [];
var introductions1 = [];
var introductions2 = [];
var br; var bm; var pn; var pp; var p; var te; var ie;
var startTime, endTime;
var startPosMap = {};
var endPosMap = {};
var oldBlock = "blockNone";
var interval = [];
var instructiondate;
var instructionstarttime;
var time = 0;
var recordTime = 0;
var selectionflag = 0;
var RainbowPath = "!";
var searchingwords = "!";
var human_voice = true;
var flip_on = true;
var start_button_pressed = false;
var initialWords1 = ['ABDUCTIONS', 'AUTHORIZED', 'BOOKKEEPER'], initialWords2 = ['ABDUCTIONS', 'HANDIWORKS', 'BARRENNESS'];
var chosenWords, specificIns;
// var random_x = 22.8, random_y = 10.8;
var init_x = 0; init_y = 0;
var setupColor = [], setupNum = [], copyNum = [];
var ending_survey = false;
var am_i_player1 = true;
var goalInfo = [], goal_top = [], goal_left = [];
// var addedBlockColor = [];
// var addedBlockLetter = [];
var origin_goal_left = [];
var origin_goal_top = [];
var end_top = [];
var end_left = [];
var origin_end_left = [];
var origin_end_top = [];
var Emax;
var isGameEnd = false;
var p_top = [], p_left = [];
var initialScore = -1;

// I am certain that these are necessary as of Sunday, October 29
var currentConfig;
var flipColorArray = [];
var flipLetterArray = [];
var letters = ["A", "B", "C", "D", "E", "F", "G"];
var color = ['red', 'blue','green','orange','yellow'];
var blockColors;
var blockLetters;
var finalBlocks;
var initialInfo = [];
var standard_info = [];
console.log('Block Colors: ', blockColors);

var rainbow_select = 0;

var generalintro = "General Instructions:<br>&emsp;In this game, you will see a table of two-sided blocks with different colors and letters on each side. You will be paired with a partner and given a task. Click the start button to start the game when you are ready to do the task. Once the task is complete, click the end button. Try to complete the task as efficiently as possible.<br>";
var blockintro = "Block instructions:<br>&emsp;Mouse right click: flips block<br>&emsp;Mouse left double click: This acts like pointing to a position on the table.<br>&emsp;Whenever you do this, the gestures box count increases by 1 and a small black block appears at the position of the gesture.<br>&emsp;Mouse left click and drag block to another position: moves block to another position.<br>&emsp;Whenever you do this, the movement box count increases by 1.<br>";

function getBlockStyle(blockColors) {
    let doc = '';
    for (var i = 0; i < NumBlocks ;i++) {
        doc += "<style> #block" + i +
            " {width: 3.8%; height: 7.35%; background-color:" +
            blockColors[i] +
            "; border:#000 solid 4px; cursor: move; position: absolute; z-index: 1; text-align: center; vertical-align: middle; line-height: 7.35%; font-family: 'Corben', Georgia, Times, serif;} </style>";
    }
    return doc;
}

function getInitialConfiguration(blockColors, flipColors, blockLetters, flipLetters) {
    let config = [];
    for (i = 0; i < blockColors.length; i++) {
        let block = {
            topLetter: blockLetters[i],
            bottomLetter: flipLetters[i],
            topColor: blockColors[i],
            bottomColor: flipColors[i],
            blockId: '#block' + i
        };
        config.push(block);
    }

    return config;
}

function getFinalConfiguration(initialConfiguration) {
    return initialConfiguration.map(block => {
        let newBlock = Object.assign({}, block);

        if (Math.random() < 0.5) {
            let tempColor = newBlock.topColor;
            let tempLetter = newBlock.topLetter;
            newBlock.topLetter = newBlock.bottomLetter;
            newBlock.topColor = newBlock.bottomColor;
            newBlock.bottomLetter = tempLetter;
            newBlock.bottomColor = tempColor;
        }

        newBlock.position = [Math.random() * 100, Math.random() * 100];

        return newBlock;
    });
}

function writeBlockStyle(blockColors) {
    document.write(getBlockStyle(blockColors));
}

function setIntroduction(num) {
    if (num == 1) {
        document.getElementById("myPopup").innerHTML = introductions1[taskID];
    } else {
        document.getElementById("myPopup").innerHTML = introductions2[taskID];
    }

}

function initInstructions() {
    task.push("Sorting");
    task.push("Matching");
    task.push("Searching");
    task.push("Construction");

    introductions1.push("Sorting:<br>&emsp;Your task is to sort the blocks in a particular way. Click the start button to start the game when you are ready to complete the task.<br>Player 1 Instructions:<br>&emsp;You will decide how you want to sort the blocks and instruct your partner to move the blocks in order to finish the task. This can be accomplished by typing instructions to your partner via the text box. No communication between you and your partner will be sent until the start button has been pressed, and the game has begun. Your partner will be able to see what you type, but will not be able to communicate with you. At any time during the game, you may double-click anywhere on the board to gesture to that location to communicate more effectively with your partner. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously. When you have determined the task has been completed according to your specifications, press the end button to complete the game and have your results recorded.");
    introductions2.push("Player 2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your responsibility will be to follow your partner's instructions as closely as possible. Pay attention to the board, as your partner is able to point to locations on the board to help you follow any instructions you are given. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously.<br>");

    introductions1.push("Matching:<br>Your task is to match the blocks in a particular way. Once the game starts, both of you and your partner will flip two separate blocks. If the blocks match, Player 1 will drag both the blocks to the left. If they don’t, Player 2 will drag both the blocks to the right. The objective of the task is to flip all of the blocks over and move them to their respective sides as quickly as possible. Click the start button to start the game when you are ready to complete the task.<br>Player 1 Instructions:<br>&emsp;You will decide by what criteria you want to match the blocks and instruct your partner to flip and move the blocks in order to finish the task. This can be accomplished by typing instructions to your partner via the text box. No communication between you and your partner will be sent until the start button has been pressed, and the game has begun. Your partner will be able to see what you type, but will not be able to communicate with you. At any time during the game, you may double-click anywhere on the board to gesture to that location to communicate more effectively with your partner. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously. When you have determined the task has been completed according to your specifications, press the end button to complete the game and have your results recorded.<br>");
    introductions2.push("Player 2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your responsibility will be to follow your partner's instructions as closely as possible. Pay attention to the board, as your partner is able to point to locations on the board to help you follow any instructions you are given. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously.<br>");


    introductions1.push("Searching:<br>You and your partner will search for one word each. You can use whatever way you want to represent that you have made your word. It doesn’t matter if you and your partner use different ways to represent this. It should be clear to anyone without talking to you that you have spelled out a word. Click the start button to start game when you are ready to do the task. Further instruction are here below:<br>User1 Instructions:<br>&emsp; Click the “show chosen” button to get the words you and your partner have to search for.<br>&emsp; Your partner doesn’t know what word they need to search for. You need to instruct your partner to be able to do this. You can only speak/type after pressing the start button. Your partner will be able to hear what you say and see what you type.<br>&emsp;You can also use gestures to point to the intended card/position to communicate effectively. You can use these gestures while speaking or at any time while playing the game. Both of you will see the outcomes of any changes either of you make to the table.<br>");
    introductions2.push("Searching:<br>ou and your partner will search for one word each. You can use whatever way you want to represent that you have made your word. It doesn’t matter if you and your partner use different ways to represent this. It should be clear to anyone without talking to you that you have spelled out a word. Click the start button to start game when you are ready to do the task. Further instruction are here below:<br>User2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your partner might also use gestures while speaking or at any time while playing the game so you must pay attention to them, try to understand what those gestures mean and do work accordingly. You have to follow his instructions and try to assist him in the best possible way. Both of you will see the outcomes of any changes either of you make to the table.<br>");
    introductions1.push("Construction:<br>User1 Instructions:<br>&emsp;1. Click “start” button. <br>&emsp;2. Click the “show the construction” button to see what pattern needs to be made. <br>&emsp;3. Instruct your partner to make pattern by typing in the text box. You can also use gestures. Your partner cannot see the pattern. <br>&emsp;Only your partner can move blocks.<br>&emsp;<br>");
    introductions2.push("Construction:<br>User2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Pay attention to the gestures. Your partner cannot move blocks.<br>");
}


function initColors(possibleColors, numBlocks) {
    let cs = [];
    for (var i = 0; i < numBlocks; i++) {
        x = Math.floor(Math.random() * possibleColors.length);
        cs.push(possibleColors[x]);
    }
    return cs;
}

function initLetters(possibleLetters, numBlocks) {
    let lets = [];
    for (var i = 0; i < numBlocks; i++) {
        y = Math.floor(Math.random() * possibleLetters.length);
        lets.push(letters[y]);
    }
    return lets;
}

function flipBlock(block_id, letter, color, config) {
    if (flip_on) {
        swapColor(block_id, config);
        swapLetter(block_id, config);
        document.getElementById("gestureToggle").style.visibility = "hidden";
        actualMove++;
        setMovement();

        let rect = document.getElementById('container').getBoundingClientRect();
        let horiz = $("#" + block_id).position().left / (rect.right - rect.left - 16) * 100;
        let vert = $("#" + block_id).position().top / (rect.bottom - rect.top - 16) * 100;

        movesTracker.add_flip(block_id, letter, color, horiz, vert);
        if (taskID == 1) {
            document.getElementById(block_id).style.borderColor = "white";
        }
    }
}

function swapColor(box, config) {
    var property = document.getElementById(box);
    var currentColor = property.style.backgroundColor;
    let index = box.substring(5);
    let newColor = config[index].bottomColor;

    property.style.backgroundColor = newColor;
    config[index].topColor = newColor;
    config[index].bottomColor = currentColor;
}

function swapLetter(box, config) {
    var currentLetter = $('#' + box).find('span').html();
    let index = box.substring(5);

    $('#' + box).find('span').html(config[index].bottomLetter);
    config[index].topLetter = config[index].bottomLetter;
    config[index].bottomLetter = currentLetter;
}

function setGestureWithPosition(left, top, event) {
    var property = document.getElementById('gestureCount');
    property.innerText = gestureCount;
    var gestureElement = document.getElementById('gestureToggle');

    var rect = document.getElementById('container').getBoundingClientRect();

    if (event == null) {
        var px_left = rect.left + ((rect.right - rect.left - 16) * (left / 100));
        var px_top = rect.top + ((rect.bottom - rect.top - 16) * (top / 100));

        gestureElement.style.left = (px_left / $(window).width() * 100) + "%";
        gestureElement.style.top = (px_top / $(window).height() * 100) + "%";
    } else {
        gestureElement.style.left = (left / $(window).width() * 100) + "%";
        gestureElement.style.top = (top / $(window).height() * 100) + "%";
    }
    gestureElement.style.visibility = "visible";

    if (event != null) {
        movesTracker.add_gesture(gestureElement.style.left,
                                 gestureElement.style.top);
    }
}

function setMovement() {
    var property = document.getElementById('MovementCount');
    property.innerText = actualMove;
    document.getElementById("gestureToggle").style.visibility = "hidden";
}


function initTaskID() {
    // taskID = Math.floor(Math.random()*4);
    taskID = 3;

    random_x = Math.floor(page_width * 0.7 / 50) - 1; random_y = Math.floor(page_height * 0.7 / 50) - 1;

    NumBlocks = 5;
    // blockColors = initBackgroundColors(NumBlocks, color);
    n1 = 5;
    n2 = 5;

    // let curLetters = [];
    // let flipLetters = [];
    // for (let i = 0; i < NumBlocks; i++) {
    //     curLetters.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
    //     flipLetterArray.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
    // }
    specificIns = "";

    // for (let i = 0; i < letters.length; i ++) {
    //     cur_letters.push(letters[i]);
    // }
    setUpVisibility();
}

// function initBackgroundColors(num, options) {
//     console.log('Initializing background colors');
//     let colors = [];
//     for (let i = 0; i < num; i++) {
//         colors.push(options[Math.floor(Math.random() * options.length)]);
//     }
//     console.log('Initialized with ', colors);
//     return colors;
// }


function setUpVisibility() {
    document.getElementById('user1').style.visibility = "hidden";
    document.getElementById('user2').style.visibility = "hidden";
    document.getElementById('vertical-line').style.visibility = "hidden";
    document.getElementById('vertical-line2').style.visibility = "hidden";
    document.getElementById('user3').style.visibility = "hidden";
    document.getElementById('user4').style.visibility = "hidden";
}

function setTaskHeader() {
    document.getElementById("taskQ").innerHTML = "Your task is: " + task[taskID] + "." + specificIns;
}

function calculateBackEndData() {
    if (taskID == 0) {
        bm = NumBlocks;
        br = NumBlocks;
        pn = 1;
        pp = 10;
        te = (br - actualMove)/(br - bm);
        ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
    } else if (taskID == 1) {
        bm = NumBlocks;
        br = 1.5 * 2 * NumBlocks;
        pn = 2;
        pp = 20;
        te = (br - actualMove)/(br - bm);
        ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
    } else if (taskID == 2) {
        bm = n1 + n2;
        br = (n1 + n2) * (NumBlocks + 1) / 2;
        pn = 1;
        pp = 10;
        te = (br - actualMove)/(br - bm);
        ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
    } else if (taskID == 3) {
        bm = n1 + n2;
        br = n1 + factorial(n2 + 1)/Math.pow(2, n2);
        pn = 2;
        pp = 20;
        te = (br - actualMove)/(br - bm);
        ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
    }
    // return "Bm" + bm + " Br" + br + " Pn" + pn + " P*" + pp + " TE" + te + " IE" + ie + " P" + p;
}

function factorial(x) {
    var c = 1; for (var i = 1; i <= x; i++) {c *= i;}
    return c;
}

function inputlength() {
    if (start_button_pressed) {
        let text = document.getElementById("txt_instruction").value;
        if (text.length != 0) {
            let numToAdd = (text.split(" ").length - 1) + 1;
            NumWords += numToAdd;
        }

        movesTracker.add_instruction(instructiondate, instructionstarttime, text);
    }
    document.getElementById("txt_instruction").value = "";
}

function movement() {
    document.getElementById("showmovement").innerHTML = actualMove;
}

// When the user clicks on div, open the popup
function popUpGameIntro() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function showChosenStuff() {
    if (taskID == 2) {
        localStorage.setItem("Searching words", initialWords1[chosenWords] + " " + initialWords2[chosenWords]);
        document.getElementById("showChosen").innerHTML = "<a class = \"buttonLike\" href=\"img/showpage.html\" onclick=\"window.open(this.href, 'newwindow', 'width=300, height=250'); return false;\">Show the searching words</a>";
    } else if (taskID == 3) {
        document.getElementById("showChosen").innerHTML =
            "<button class=\"buttonLike\""
            + "style=\"vertical-align: middle;\""
            + "onclick=\"showConstruction(finalBlocks)\">"
            + "Show the Construction"
            + "</button>";
    }
}

function showConstruction(blocks) {
    let toSet = document.getElementById("container").cloneNode(true).innerHTML;
    localStorage.setItem("container", toSet);
    localStorage.setItem('finalBlocks', JSON.stringify(blocks));
    window.open('initial_board.html', 'newwindow', 'width=400, height=175');
    return false;
}

function getDateTime() {
    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    return month + "/" + day + "/" + year + " " + hour + ":" + min + ":" + sec;
}

function instructiontime() {
    instructionstarttime = new Date().getTime();
    instructiondate = getDateTime();
}

function setUpInitialPosition(bColors, flipColors, bLetters, flipLetters, finalBlocks) {
    console.log('Calling setUpInitialPosition');
    console.log('Block colors:', bColors);
    for (let i = 0; i < NumBlocks; i++) {
        var tLeft = 0;
        var tTop = 0;

        var horizontal_percent = (document.getElementById('container').getBoundingClientRect().right - 50 - 8 - 4 - 4) / document.getElementById('container').getBoundingClientRect().right * 100;
        var vertical_percent = (document.getElementById('container').getBoundingClientRect().bottom - 50 - 8 - 4 - 4) / document.getElementById('container').getBoundingClientRect().bottom * 100;

        tLeft = Math.random() * Math.floor(horizontal_percent);
        tTop = Math.random() * Math.floor(vertical_percent);

        p_left.push(tLeft);
        p_top.push(tTop);

        end_left.push(tLeft);
        end_top.push(tTop);

        initialInfo.push("block:" + i + " " +
                         "initial position: (" + tLeft + "%, " + tTop + "%) " +
                         "color: " + bColors[i] +
                         " letters: " + bLetters[i] +
                         " flipletters: " + flipLetters[i]);
        document.getElementById("block" + i).style.top = tTop+"%";
        document.getElementById("block" + i).style.left = tLeft+"%";
    }

    console.log('Initial Info:', initialInfo);
    document.getElementById('scoreBox').innerText = Math.round(scoreCal(finalBlocks));
}

function centroid(x, y) {
    var centerX = 0, centerY = 0;
    for (var i = 0; i < x.length; i++) {
        centerX += x[i];
        centerY += y[i];
    }
    centerX /= x.length;
    centerY /= y.length;
    var center = [];
    center.push(centerX);
    center.push(centerY);
    return center;
}

function scoreCal(finalBlocks) {
    let goal_left = finalBlocks.map(block => block.position[0]);
    let goal_top = finalBlocks.map(block => block.position[1]);

    var centerC = centroid(goal_left, goal_top);
    var centerA = centroid(end_left, end_top);
    var errorX = 0;
    var errorY = 0;
    for (var index = 0; index < NumBlocks; index++) {
        errorX = errorX + Math.abs((end_left[index] - centerA[0]) - (goal_left[index] - centerC[0]));
        errorY = errorY + Math.abs((end_top[index] - centerA[1]) - (goal_top[index] - centerC[1]));
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
