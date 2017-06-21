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

var generalintro = "General Instructions:<br>&emsp;In this game, you will see a table of two-sided cards with different colors and letters on each side. You will be paired with a partner and given a task. Click the start button to start the game when you are ready to do the task. Once the task is complete, click the end button. Try to complete the task as efficiently as possible.<br>";
var cardintro = "Card instructions:<br>&emsp;Mouse right click: flips card<br>&emsp;Mouse left double click: This acts like pointing to a position on the table.<br>&emsp;Whenever you do this, the gestures box count increases by 1 and a small black block appears at the position of the gesture.<br>&emsp;Mouse left click and drag card to another position: moves card to another position.<br>&emsp;Whenever you do this, the movement box count increases by 1.<br>";


for (var i = 0; i < NumBlocks ;i++) {
    var x= Math.floor(Math.random() * 5);
    document.write("<style> #block"+i+" {width: 50px; height: 50px; background:"+color[x] +"; border:#000 solid 4px; cursor: move; position: absolute; z-index: 1; text-align: center; vertical-align: middle; line-height: 50px; font-family: 'Corben', Georgia, Times, serif;} </style>");
}

function setIntroduction() {
    document.getElementById("myPopup").innerHTML = generalintro + cardintro + introductions1[taskID];
}

function initInstructions() {
    task.push("Sorting");
    task.push("Matching");
    task.push("Searching");
    task.push("Rainbow");

    introductions1.push("Sorting:<br>&emsp;Your task is to sort the blocks in a particular way.<br>User1 Instructions:<br>&emsp;You will decide how you want to sort the block and instruct your partner to get help finishing the task, by speaking into your device’s microphone, or by typing in the text box. You can only speak/type after pressing the start button. Your partner will be able to hear what you say and see what you type. You can also use gestures to point to the intended card/position to communicate effectively. You can use these gestures while speaking or at any time while playing the game.<br>&emsp;The partner will assist you in the sorting task according to your instructions but only you can speak to him. The partner can’t speak back. Both of you will be able to see anything either of you do on the table.");
    introductions2.push("Sorting:<br>&emsp;Your task is to sort the blocks in a particular way.<br>User2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your partner might also point while speaking or at any time while playing the game so you must pay attention to them and try to cooperate.You have to follow your partner’shis instructions and try to assist your partnerhim in the best possible way. Both of you will will be able to see anything either of you do on the table.<br>");
    introductions1.push("Matching:<br>Your task is to match the blocks in a particular way. Once the game starts, both of you and your partner will simultaneously flip two separate blocks. If the blocks match, user1 should drag both the blocks to the left. If they don’t, the user2 will drag both the blocks to the right.Your goal is to flip all the blocks. If one block is left at the end, user1 will drag it to the left and click the end button.<br>User1 Instructions:<br>&emsp;You will decide by what criteria you want to match the cards and instruct your partner in order to get help finishing the task, by speaking into your device’s microphone, or by typing in the text box. You can only speak/type after pressing the start button. Your partner will be able to hear what you say and see what you type. You can also use gestures to point to the intended card/position to communicate effectively. You can use these gestures while speaking or at any time while playing the game.<br>&emsp;Your partner will be able to hear what you say and see what you type but they will not be able to talk or type to you. Both of you will see the outcomes of any changes either of you make to the table.<br>");
    introductions2.push("Matching:<br>Your task is to match the blocks in a particular way. Once the game starts, both of you and your partner will simultaneously flip two separate blocks. If the blocks match, user1 should drag both the blocks to the left. If they don’t, the user2 will drag both the blocks to the right.Your goal is to flip all the blocks. If one block is left at the end, user1 will drag it to the left and click the end button.<br>User2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your partner might also use gestures while speaking or at any time while playing the game so you must pay attention to them, try to understand what those gestures mean and do work accordingly. You have to follow his instructions and try to assist him in the best possible way. Both of you will see the outcomes of any changes either of you make to the table.<br>");
    introductions1.push("Searching:<br>Your task is to search for a word. You can use whatever way you want to represent that you have made your word. It doesn’t matter if you and your partner use different ways to represent this. It should be clear to anyone without talking to you that you have spelled out a word. Click the start button to start game when you are ready to do the task. Further instruction are here below:<br>User1 Instructions:<br>&emsp;Select two related words after looking at all the cards. Type in the word into the textboxes, “word for user 1” (your word) and “word for user 2”(partner’s word).<br>&emsp;Tell your partner which one of those words you are going to search and which ones they are supposed to search. You can only speak/type after pressing the start button. Your partner will be able to hear what you say and see what you type.<br>&emsp;You can also use gestures to point to the intended card/position to communicate effectively. You can use these gestures while speaking or at any time while playing the game. Both of you will see the outcomes of any changes either of you make to the table.<br>");
    introductions2.push("Searching:<br>Your task is to search for a word. You can use whatever way you want to represent that you have made your word. It doesn’t matter if you and your partner use different ways to represent this. It should be clear to anyone without talking to you that you have spelled out a word. Click the start button to start game when you are ready to do the task. Further instruction are here below:<br>User2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your partner might also use gestures while speaking or at any time while playing the game so you must pay attention to them, try to understand what those gestures mean and do work accordingly. You have to follow his instructions and try to assist him in the best possible way. Both of you will see the outcomes of any changes either of you make to the table.<br>");
    introductions1.push("Rainbow:<br>You need to draw a specific pattern (like a triangle) using the cards, along with your partner.<br>User1 Instructions:<br>&emsp;You will decide what pattern to make and instruct your partner to get help finishing the task, by speaking into your device’s microphone, or by typing in the text box. You can only speak/type after pressing the start button. Your partner will be able to hear what you say and see what you type. You can also use gestures to point to the intended card/position to communicate effectively. You can use these gestures while speaking or at any time while playing the game.<br>&emsp;The partner will assist you in the task according to your instructions but only you can speak to him. He can’t speak back. Both of you will see the outcomes of any changes either of you make to the table.<br>");
    introductions2.push("Rainbow:<br>You need to draw a specific pattern (like a triangle) using the cards, along with your partner.<br>User2 Instructions:<br>&emsp;Your partner will give you instructions to complete the task. Your partner might also use gestures while speaking or at any time while playing the game so you must pay attention to them, try to understand what those gestures mean and do work accordingly. You have to follow his instructions and try to assist him in the best possible way. Both of you will see the outcomes of any changes either of you make to the table.<br>");
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
    swapColor(box);
    swapLetter(box);
    document.getElementById("gestureToggle").style.visibility = "hidden";
    actualMove++;
    setMovement();
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

}

function setRefLink() {
    if (taskID==3){
        document.getElementById("referenceLink").style.visibility = "visible";
        document.getElementById("referenceLink").innerHTML = "<a class = \"buttonLike\" href=\"Public/selection_rainbow.html\" target=\"_blank\">Select Your Rainbow Path!</a>";
    } else if (taskID==2) {
        document.getElementById("referenceLink").style.visibility = "visible";
        document.getElementById("referenceLink").innerHTML = "<a class = \"buttonLike\" href=\"Public/selection_searching.html\" target=\"_blank\">Select Your Words Here!</a>";
    }
}

function setTaskHeader() {
    document.getElementById("taskQ").innerHTML = "Today, you will have task: " + task[taskID] + "!";
}

function calculateBackEndData() {
    if (taskID == 0) {
        bm = NumBlocks; br = NumBlocks; pn = 1; pp = 10;
        te = (br - actualMove)/(br - bm); ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
    } else if (taskID == 1) {
        bm = n1 + n2; br = (n1 + n2) * (NumBlocks + 1) / 2; pn = 1; pp = 10;
        te = (br - actualMove)/(br - bm); ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
    } else if (taskID == 2) {
        bm = NumBlocks; br = 1.5 * 2 * NumBlocks; pn = 2; pp = 20;
        te = (br - actualMove)/(br - bm); ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
    } else if (taskID == 3) {
        bm = n1 + n2; br = n1 + factorial(n2 + 1)/Math.pow(2, n2); pn = 2; pp = 20;
        te = (br - actualMove)/(br - bm); ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
    }
    return "Bm" + bm + " Br" + br + " Pn" + pn + " P*" + pp + " TE" + te + " IE" + ie + " P" + p;
}

function factorial(x) {
    var c = 1; for (var i = 1; i <= x; i++) {c *= i;}
    return c;
}

function inputlength() {
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
        document.getElementById("showChosen").innerHTML = "<a class = \"buttonLike\" href=\"img/showpage.html\" onclick=\"window.open(this.href, 'newwindow', 'width=300, height=250'); return false;\">Show Your choice</a>";
    } else if (taskID == 3) {
        var x = RainbowPath.substring(RainbowPath.indexOf(" ") + 1, RainbowPath.length);
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