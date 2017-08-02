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
var instructions = [];
var time = 0;
var recordTime = 0;
var selectionflag = 0;
var RainbowPath = "!";
var searchingwords = "!";
var human_voice = true;
var flip_on = true;
var start_button_pressed = false;
var blocks_x, blocks_y;
var initialWords1 = ['ABDUCTIONS', 'AUTHORIZED', 'BOOKKEEPER'], initialWords2 = ['ABDUCTIONS', 'HANDIWORKS', 'BARRENNESS'];
var chosenWords, specificIns;
var random_x = 22.8, random_y = 10.8;
var init_x = 0; init_y = 0;
var setupColor = [], setupNum = [], copyNum = [];
var movement_startpos = [], movement_endpos = [];
var time_GF = [];
var GF_position = [];
var players = [];
var block_actions = [];
var ending_survey = false;
var am_i_player1 = true;
var initialInfo = [];
var goalInfo = [], goal_top = [], goal_left = [];
var cur_letters = [];
var addedBlockColor = [];
var addedBlockLetter = [];
var numBlocks = 5;
var origin_goal_left = [];
var origin_goal_top = [];
var end_top = [];
var end_left = [];
var origin_end_left = [];
var origin_end_top = [];
var Emax;
var isGameEnd = false;
var p_top = [], p_left = [];
var standard_info = [];

var rainbow_select = 0;

var generalintro = "General Instructions:<br>&emsp;In this game, you will see a table of two-sided blocks with different colors and letters on each side. You will be paired with a partner and given a task. Click the start button to start the game when you are ready to do the task. Once the task is complete, click the end button. Try to complete the task as efficiently as possible.<br>";
var blockintro = "Block instructions:<br>&emsp;Mouse right click: flips block<br>&emsp;Mouse left double click: This acts like pointing to a position on the table.<br>&emsp;Whenever you do this, the gestures box count increases by 1 and a small black block appears at the position of the gesture.<br>&emsp;Mouse left click and drag block to another position: moves block to another position.<br>&emsp;Whenever you do this, the movement box count increases by 1.<br>";

function calculateEmax() {
    window.onload = function() {
        var width = document.getElementById("#container").style.width;
        var height = document.getElementById("#container").style.height;
        Emax = width + height;
    }
}
function writeBlocks() {
    for (var i = 0; i < NumBlocks ;i++) {
        var x= Math.floor(Math.random() * 5);
        document.write("<style> #block"+i+" {width: 50px; height: 50px; background-color:"+color[x] +"; border:#000 solid 4px; cursor: move; position: absolute; z-index: 1; text-align: center; vertical-align: middle; line-height: 50px; font-family: 'Corben', Georgia, Times, serif;} </style>");
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


function initFlipColors() {
    for (var i = 0; i < Max_Num_Blocks; i++) {
        x = Math.floor(Math.random() * 5);
        flipColorArray[i] = color[x];
    }
}

function initFlipLetters() {
    for (var i = 0; i < Max_Num_Blocks; i++) {
        y = Math.floor(Math.random() * letters.length);
        flipLetterArray[i] = letters[y];
    }
}

function flipBlock(box, event) {
    if (flip_on) {
        swapColor(box);
        swapLetter(box);
        document.getElementById("gestureToggle").style.visibility = "hidden";
        actualMove++;
        setMovement();
        if (event != null) {
            GF_position.push("(" + event.clientX + "," + event.clientY + ")");
            type.push("Flip");
            time_GF.push(getDateTime());
            if (taskID == 1) {
                document.getElementById("block" + box.substring(5)).style.borderColor = "white";
            }
        }  
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
    cur_letters[box.substring(5)] = currentLetter;
}

function setGestureWithPosition(left, top, event) {
    var property = document.getElementById('gestureCount');
    property.innerText = gestureCount;
    var gestureElement = document.getElementById('gestureToggle');
    gestureElement.style.left = left + 'px';
    gestureElement.style.top = top + 'px';
    gestureElement.style.visibility = "visible";

    if (event != null) {
        time_GF.push(getDateTime());
        GF_position.push("(" + event.clientX + "," + event.clientY + ")");
        type.push("Gesture");
    }
    
}

function setMovement() {
    var property = document.getElementById('MovementCount');
    property.innerText = actualMove;
    document.getElementById("gestureToggle").style.visibility = "hidden";
}


function initTaskID() {
    taskID = Math.floor(Math.random()*4);
    taskID = 3;

    random_x = Math.floor(page_width * 0.7 / 50) - 1; random_y = Math.floor(page_height * 0.7 / 50) - 1;

    if (taskID == 1) {
        random_x = Math.floor(page_width * 0.7 / 150) - 1; init_x = Math.floor(0.7 * page_width / 150 + 1) * 50;
        if (NumBlocks % 2 == 1) {
            NumBlocks++;
        }
        if (Math.random() < 0.5) {
            specificIns = " (Check if the cards match by color.)";
        } else {
            specificIns = " (Check if the cards match by letter.)";
        }
        
        letters = [];
        for (var i = 0; i < NumBlocks; i++) {
            letters.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
            flipLetterArray.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
        }
    }

    if (taskID == 2) {
        chosenWords = Math.floor(Math.random() * 3);
        NumBlocks = Math.floor(Math.random() * random_multiplier) + initialWords1[chosenWords].length + initialWords2[chosenWords].length;
        letters = [];
        for (var i = 0; i < initialWords1[chosenWords].length; i++) {
            var p = Math.floor(Math.random() * 2);
            if (p == 0) {
                letters.push(initialWords1[chosenWords][i]);
                flipLetterArray.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
            } else {
                flipLetterArray.push(initialWords1[chosenWords][i]);
                letters.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
            }
        }

        for (var i = 0; i < initialWords2[chosenWords].length; i++) {
            var p = Math.floor(Math.random() * 2);
            if (p == 0) {
                letters.push(initialWords2[chosenWords][i]);
                flipLetterArray.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
            } else {
                flipLetterArray.push(initialWords2[chosenWords][i]);
                letters.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
            }
        }

        for (var i = initialWords2[chosenWords].length + initialWords1[chosenWords].length; i < NumBlocks; i++) {
            flipLetterArray.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
            letters.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
        }
        n1 = initialWords1[chosenWords].length;
        n2 = initialWords2[chosenWords].length;
        specificIns = "";
    }

    if (taskID == 3) {
        NumBlocks = 5;
        n1 = 5; n2 = 5;
        // setupColor = ['red', 'blue', 'yellow', 'green', 'orange'];
        // setupNum = [1, 1, 1, 1, 1];

        letters = [];
        for (var i = 0; i < NumBlocks; i++) {
            letters.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
            flipLetterArray.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
        }
        specificIns = "";
    }

    if (taskID == 0) {
        if (Math.random() < 0.5) {
            specificIns = " (Group the cards by letter.)";
        } else {
            specificIns = " (Group the cards by color.)";
        }
        
        letters = [];
        for (var i = 0; i < NumBlocks; i++) {
            letters.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
            flipLetterArray.push(String.fromCharCode("A".charCodeAt(0) + Math.floor(Math.random() * 8)));
        }
    }

    for (var i = 0; i < letters.length; i ++) {
        cur_letters.push(letters[i]);
    }
    console.log(cur_letters);
    setUpVisibility();
}
    

function setUpVisibility() {
    if (taskID == 1) {
        //document.getElementById('vertical-line3').style.visibility = "hidden";
        document.getElementById('user1').style.visibility = "hidden";
        document.getElementById('user2').style.visibility = "hidden";
        document.getElementById('user3').style.visibility = "visible";
        document.getElementById('user4').style.visibility = "visible";

    }
    if (taskID == 2 || taskID == 0) {
        document.getElementById('vertical-line').style.visibility = "hidden";
        document.getElementById('vertical-line2').style.visibility = "hidden";
        document.getElementById('user3').style.visibility = "hidden";
        document.getElementById('user4').style.visibility = "hidden";
        //document.getElementById('vertical-line3').style.visibility = "hidden";
        document.getElementById('user1').style.visibility = "hidden";
        document.getElementById('user2').style.visibility = "hidden";
    }
    if (taskID == 3) {
        document.getElementById('user1').style.visibility = "hidden";
        document.getElementById('user2').style.visibility = "hidden";
        document.getElementById('vertical-line').style.visibility = "hidden";
        document.getElementById('vertical-line2').style.visibility = "hidden";
        document.getElementById('user3').style.visibility = "hidden";
        document.getElementById('user4').style.visibility = "hidden";
    }
}

function setRefLink() {
    if (taskID==3){
        // document.getElementById("referenceLink").style.visibility = "visible";
        // document.getElementById("referenceLink").innerHTML = "<a class = \"buttonLike\" href=\"selection_rainbow.html\" target=\"_blank\">Select Your Rainbow Path!</a>";
    } else if (taskID==2) {
        // document.getElementById("referenceLink").style.visibility = "visible";
        // document.getElementById("referenceLink").innerHTML = "<a class = \"buttonLike\" href=\"selection_searching.html\" target=\"_blank\">Select Your Words Here!</a>";
    }
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
        end.push(getDateTime());
        start.push(instructiondate);
        type.push("Instructions");
        interval.push(new Date().getTime() - instructionstarttime);
        var x = document.getElementById("txt_instruction").value;
        if (x.length != 0) {
            var numToAdd = (x.split(" ").length - 1) + 1;
            NumWords += numToAdd;
        }
        instructions.push(x);  
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
        document.getElementById("showChosen").innerHTML = "<a class = \"buttonLike\" href=\"initial_board.html\" onclick=\"window.open(this.href, 'newwindow', 'width=800, height=350'); return false;\">Show the Construction</a>";
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

function setUpInitialPosition() {
    for (var i = 0; i < NumBlocks; i++) {
        var tLeft = Math.floor(Math.random()*random_x) * 50 + init_x,
        tTop  = Math.floor(Math.random()*random_y) * 50 + init_y;
        var flag = -1;
        for (var j = 0; j < p_left.length;j ++) {
            if (p_top[j] == tTop && p_left[j] == tLeft) {
                flag = j; break;
            }
        }
        if (flag == -1) {
            p_top.push(tTop);
            p_left.push(tLeft);
        } else {
            while (flag != -1) {
                flag = -1;
                tLeft = Math.floor(Math.random()*random_x) * 50 + init_x,
                tTop  = Math.floor(Math.random()*random_y) * 50 + init_y;
                for (var j = 0; j < p_left.length;j ++) {
                    if (p_top[j] == tTop && p_left[j] == tLeft) {
                        flag = j; break;
                    }
                }
            }
            p_top.push(tTop);
            p_left.push(tLeft);
        }
        end_left.push(tTop);
        end_top.push(tLeft);

        var flip_or_not = Math.random();

        initialInfo.push("block:" + i + " " + "initial position: (" + tLeft + ", " + tTop + ") color: " + color[i] + " letters: " + letters[i] + " flipletters: " + flipLetterArray[i]);
        document.getElementById("block" + i).style.top = tTop+"px";
        document.getElementById("block" + i).style.left = tLeft+"px";
    }
    document.getElementById('scoreBox').innerText = Math.round(scoreCal());
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

function scoreCal() {
    var centerC = centroid(goal_left, goal_top);
    var centerA = centroid(end_left, end_top);
    var errorX = 0;
    var errorY = 0;
    for (var index = 0; index < NumBlocks; index++) {
        errorX = errorX + Math.abs((end_left[index] - centerA[0]) - (goal_left[index] - centerC[0]));
        errorY = errorY + Math.abs((end_top[index] - centerA[1]) - (goal_top[index] - centerC[1]));
    }

    var totalError = errorY + errorX;
    var fat = $("#container").width();
    var tall = $("#container").height(); 
    
    var Emax = (tall + fat) * 5;
    var score = ((Emax - totalError) / Emax) * 100;

    if (initialScore != -1) {
        return 100 / (100 - initialScore) * (score - initialScore);
    } else {
        initialScore = score;
        return 0;
    }
}