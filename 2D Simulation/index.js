var page_width = 0;
var page_height = 0;
var random_multiplier = 10;
var random_addition = 4;
var NumBlocks = 5;
var gestureCount = 0;
var NumWords = 0;
var n1 = 5; var n2 = 5;
var actualMove = 0;
var w1 = 0.1, w2 = 0.5;
var previous_top = [];var previous_left = [];
var x;
var y;
var br; var bm; var pn; var pp; var p; var te; var ie;
var oldBlock = "blockNone";
var interval = [];
var instructiondate;
var instructionstarttime;
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
        blocks.flip_block(block_id.substring(5))
        document.getElementById("gestureToggle").style.visibility = "hidden";
        actualMove++;
        hide_gesture();

        let rect = document.getElementById('container').getBoundingClientRect();
        let horiz = $("#" + block_id).position().left / (rect.right - rect.left - 16) * 100;
        let vert = $("#" + block_id).position().top / (rect.bottom - rect.top - 16) * 100;

        movesTracker.add_flip(block_id, letter, color, horiz, vert);
    }
}

function setGestureWithPosition(left, top, event) {
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

function initTaskID() {
    random_x = Math.floor(page_width * 0.7 / 50) - 1; random_y = Math.floor(page_height * 0.7 / 50) - 1;

    specificIns = "";

    setUpVisibility();
}

function setUpVisibility() {
    document.getElementById('user1').style.visibility = "hidden";
    document.getElementById('user2').style.visibility = "hidden";
    document.getElementById('vertical-line').style.visibility = "hidden";
    document.getElementById('vertical-line2').style.visibility = "hidden";
    document.getElementById('user3').style.visibility = "hidden";
    document.getElementById('user4').style.visibility = "hidden";
}

function setTaskHeader() {
    document.getElementById("taskQ").innerHTML = "Blocksworld";
}

function calculateBackEndData() {
    bm = n1 + n2;
    br = n1 + factorial(n2 + 1)/Math.pow(2, n2);
    pn = 2;
    pp = 20;
    te = (br - actualMove)/(br - bm);
    ie = (w1 * NumWords + w2 * gestureCount)/bm;
    p = te/ie;
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

function showConstruction(blocks) {
    let toSet = document.getElementById("container").cloneNode(true).innerHTML;
    localStorage.setItem("container", toSet);
    localStorage.setItem('finalBlocks', JSON.stringify(blocks));
    window.open('solution_board.html', 'newwindow', 'width=400, height=175');
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
