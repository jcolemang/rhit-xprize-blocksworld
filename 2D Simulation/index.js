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
var flipColorArray = [];
var flipLetterArray = [];
var x;
var y;
var letters = ["A", "B", "C", "D", "E", "F", "G"];
var color = ['red', 'blue','green','orange','yellow'];
var taskID = 0;
var task = [];
var introductions1 = [];
var introductions2 = [];
var br; var bm; var pn; var pp; var p; var te; var ie;
var startTime, endTime;
var startPosMap = {};
var endPosMap = {};
var oldBlock = "blockNone";
var start = [];
var end = [];
var interval = [];
var type = [];
var instructiondate;
var instructionstarttime;
var instructions = "";
var time;
var selectionflag = 0;
var RainbowPath = "!";
var searchingwords = "!";
var human_voice = true;
var flip_on = true;
var start_button_pressed = false;
var blocks_x, blocks_y;
var initialWords1 = ['ABCDE', 'POSITION'], initialWords2 = ['AQERI', 'PREVIOUS'];
var chosenWords;
var random_x = 22.8, random_y = 10.8;
var init_x = 0; init_y = 0;

var generalintro = "General Instructions:<br>&emsp;In this game, you will see a table of two-sided blocks with different colors and letters on each side. You will be paired with a partner and given a task. Click the start button to start the game when you are ready to do the task. Once the task is complete, click the end button. Try to complete the task as efficiently as possible.<br>";
var blockintro = "Block instructions:<br>&emsp;Mouse right click: flips block<br>&emsp;Mouse left double click: This acts like pointing to a position on the table.<br>&emsp;Whenever you do this, the gestures box count increases by 1 and a small black block appears at the position of the gesture.<br>&emsp;Mouse left click and drag block to another position: moves block to another position.<br>&emsp;Whenever you do this, the movement box count increases by 1.<br>";

function writeBlocks() {
    for (var i = 0; i < NumBlocks ;i++) {
        var x= Math.floor(Math.random() * 5);
        document.write("<style> #block"+i+" {width: 50px; height: 50px; background:"+color[x] +"; border:#000 solid 4px; cursor: move; position: absolute; z-index: 1; text-align: center; vertical-align: middle; line-height: 50px; font-family: 'Corben', Georgia, Times, serif;} </style>");
    }
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
    task.push("Rainbow");

    introductions1.push("Sorting:<br>&emsp;Your task is to sort the blocks in a particular way. Click the start button to start the game when you are ready to complete the task.<br>Player 1 Instructions:<br>&emsp;You will decide how you want to sort the blocks and instruct your partner to move the blocks in order to finish the task. This can be accomplished by speaking to your partner through your device’s microphone, or by typing instructions to your partner via the text box. No communication between you and your partner will be sent until the start button has been pressed, and the game has begun. Your partner will be able to hear what you say and see what you type, but will not be able to communicate with you. At any time during the game, you may double-click anywhere on the board to gesture to that location to communicate more effectively with your partner. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously. When you have determined the task has been completed according to your specifications, press the end button to complete the game and have your results recorded.");
    introductions2.push("Player 2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your responsibility will be to follow your partner's instructions as closely as possible. Pay attention to the board, as your partner is able to point to locations on the board to help you follow any instructions you are given. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously.<br>");
    introductions1.push("Matching:<br>Your task is to match the blocks in a particular way. Once the game starts, both of you and your partner will flip two separate blocks. If the blocks match, Player 1 will drag both the blocks to the left. If they don’t, Player 2 will drag both the blocks to the right. The objective of the task is to flip all of the blocks over and move them to their respective sides as quickly as possible. Click the start button to start the game when you are ready to complete the task.<br>Player 1 Instructions:<br>&emsp;You will decide by what criteria you want to match the blocks and instruct your partner to flip and move the blocks in order to finish the task. This can be accomplished by speaking to your partner through your device’s microphone, or by typing instructions to your partner via the text box. No communication between you and your partner will be sent until the start button has been pressed, and the game has begun. Your partner will be able to hear what you say and see what you type, but will not be able to communicate with you. At any time during the game, you may double-click anywhere on the board to gesture to that location to communicate more effectively with your partner. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously. When you have determined the task has been completed according to your specifications, press the end button to complete the game and have your results recorded.<br>");
    introductions2.push("Player 2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your responsibility will be to follow your partner's instructions as closely as possible. Pay attention to the board, as your partner is able to point to locations on the board to help you follow any instructions you are given. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously.<br>");
    introductions1.push("Searching:<br>Your task is to search for blocks on the board in order to create a pair of words. Click the start button to start the game when you are ready to complete the task.<br>Player 1 Instructions:<br>&emsp;Select a pair of words that you will search for. Tell your partner which one of those words you are going to search for and which one they will search for. This can be accomplished by speaking to your partner through your device’s microphone, or by typing instructions to your partner via the text box. No communication between you and your partner will be sent until the start button has been pressed, and the game has begun. Your partner will be able to hear what you say and see what you type, but will not be able to communicate with you. At any time during the game, you may double-click anywhere on the board to gesture to that location to communicate more effectively with your partner. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously. When you have determined the task has been completed according to your specifications, press the end button to complete the game and have your results recorded.<br>");
    introductions2.push("Player 2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your responsibility will be to follow your partner's instructions as closely as possible. Pay attention to the board, as your partner is able to point to locations on the board to help you follow any instructions you are given. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously.<br>");
    introductions1.push("Rainbow:<br>Your task is to create a specific pattern (like a triangle) using the blocks, along with your partner. Click the start button to start the game when you are ready to complete the task.<br>Player 1 Instructions:<br>&emsp;You will decide what pattern you want to create with the blocks and provide instructions for your partner to move the blocks in order to finish the task. Both you and your partner are permitted to move the blocks in any way you choose, but it is encouraged that both of you move half of the blocks each in order to complete the pattern. This can be accomplished by speaking to your partner through your device’s microphone, or by typing instructions to your partner via the text box. No communication between you and your partner will be sent until the start button has been pressed, and the game has begun. Your partner will be able to hear what you say and see what you type, but will not be able to communicate with you. At any time during the game, you may double-click anywhere on the board to gesture to that location to communicate more effectively with your partner. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously. When you have determined the task has been completed according to your specifications, press the end button to complete the game and have your results recorded.<br>");
    introductions2.push("Player 2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your responsibility will be to follow your partner's instructions as closely as possible. Pay attention to the board, as your partner is able to point to locations on the board to help you follow any instructions you are given. Blocks can be moved by holding down left click and dragging them across the screen. Blocks can be flipped by right clicking them. All actions performed on the board will be seen by both players simultaneously.<br>");
}


function initFlipColors() {
    for (var i = 0; i < Max_Num_Blocks; i++) {
        x = Math.floor(Math.random() * 5);
        flipColorArray[i] = color[x];
    }
}

function initFlipLetters() {
    for (var i = 0; i < Max_Num_Blocks; i++) {
        y = Math.floor(Math.random() * 7);
        flipLetterArray[i] = letters[y];
    }
}

function flipBlock(box) {
    if (flip_on) {
        swapColor(box);
        swapLetter(box);
        document.getElementById("gestureToggle").style.visibility = "hidden";
        actualMove++;
        setMovement();
    }
    
}

function swapColor(box) {
    var property = document.getElementById(box);
    var currentColor = property.style.backgroundColor;
    property.style.backgroundColor = flipColorArray[box.substring(5)];
    flipColorArray[box.substring(5)] = currentColor;
}

function swapLetter(box) {
    var property = document.getElementById(box);
    var currentLetter = property.textContent || property.innerText;
    property.textContent = flipLetterArray[box.substring(5)];
    flipLetterArray[box.substring(5)] = currentLetter;
}

function setGestureWithPosition(left, top) {
    var property = document.getElementById('gestureCount');
    property.innerText = gestureCount;
    var gestureElement = document.getElementById('gestureToggle');
    gestureElement.style.left = left + 'px';
    gestureElement.style.top = top + 'px';

    gestureElement.style.visibility = "visible";
}

function setMovement() {
    var property = document.getElementById('MovementCount');
    property.innerText = actualMove;
    document.getElementById("gestureToggle").style.visibility = "hidden";
}

function initTaskID() {
    taskID = Math.floor(Math.random()*4);
    if (taskID == 2) {
        chosenWords = Math.floor(Math.random() * initialWords1.length);
        NumBlocks = Math.floor(Math.random() * random_multiplier) + initialWords1[chosenWords].length + initialWords2[chosenWords].length;
        letters = [];
        for (var i = 0; i < initialWords1[chosenWords].length; i++) {
            letters.push(initialWords1[chosenWords][i]);
            letters.push(initialWords2[chosenWords][i]);
        }
        n1 = initialWords1[chosenWords].length;
        n2 = initialWords2[chosenWords].length;
    }
    if (taskID != 1) {
        document.getElementById('vertical-line').style.visibility = "hidden";
        document.getElementById('vertical-line2').style.visibility = "hidden";
    } else {
        random_x = 6; init_x = 450;
        if (NumBlocks % 2==1) {
            NumBlocks++;
        }
    }
    if (taskID == 3) {
         NumBlocks = Math.floor(Math.random() * random_multiplier) + 10;
    }
}

function setRefLink() {
    if (taskID==3){
        document.getElementById("referenceLink").style.visibility = "visible";
        document.getElementById("referenceLink").innerHTML = "<a class = \"buttonLike\" href=\"selection_rainbow.html\" target=\"_blank\">Select Your Rainbow Path!</a>";
    } else if (taskID==2) {
        // document.getElementById("referenceLink").style.visibility = "visible";
        // document.getElementById("referenceLink").innerHTML = "<a class = \"buttonLike\" href=\"selection_searching.html\" target=\"_blank\">Select Your Words Here!</a>";
    }
}

function setTaskHeader() {
    document.getElementById("taskQ").innerHTML = "Today, you will have task: " + task[taskID] + "!";
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
        end.push(getDateTime());
        start.push(instructiondate);
        type.push("Instructions");
        interval.push(new Date().getTime() - instructionstarttime);
        var x = document.getElementById("txt_instruction").value;
        if (x.length != 0) {
            var numToAdd = (x.split(" ").length - 1) + 1;
            NumWords += numToAdd;
        }
        instructions += x + "\n";  
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
        RainbowPath = localStorage.getItem("Rainbow Path");
        var x = RainbowPath.substring(RainbowPath.indexOf(" ") + 1, RainbowPath.length);
        console.log(x);
        document.getElementById("showChosen").innerHTML = "<a class = \"buttonLike\" href=\"img/rainbow"+ x +".png\" onclick=\"window.open(this.href, 'newwindow', 'width=500, height=450'); return false;\">Show Your choice</a>";
    }
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