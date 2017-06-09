var NumBlocks = Math.floor(Math.random() * 10) + 4;
var gestureCount = 0;
var NumWords = 0;
var n1 = 1; var n2 = 1;
var actualMove = 0;
var w1 = 0.1, w2 = 0.5;
var previous_top = [];var previous_left = [];
var colorMap = new Map();
var letterMap = new Map();
var x;
var y;
var letters = ["A", "B", "C", "D", "E", "F", "G"];
var color = ['red', 'blue','green','orange','yellow'];
var taskID = 0;
var task = [];
var instructions = [];
var br; var bm; var pn; var pp; var p; var te; var ie;
var startTime, endTime;
var startPosMap = {};
var endPosMap = {};
var oldBlock = "blockNone";



for (var i = 0; i < NumBlocks ;i++) {
    var x= Math.floor(Math.random() * 5);
    document.write("<style> #block"+i+" {width: 50px; height: 50px; background:"+color[x] +"; border:#000 solid 4px; cursor: move; position: absolute; z-index: 1; text-align: center; vertical-align: middle; line-height: 50px;} </style>");
}

function initInstructions() {
    task.push("Sorting");
    task.push("Matching"); 
    task.push("Searching");
    task.push("Rainbow");
    instructions.push("Sorting:<br><br>User1 Instructions:<br>&emsp;You have to give the other user an instruction to sort the blocks in a particular way." + 
        "<br>&emsp;When you speak, the converted text will show up in the text box.<br>Once the task is complete, click the end button.<br><br>User2 " + 
        "Instructions:<br>&emsp;The other user will give you instructions to complete the task.<br>&emsp;Try to complete it in the minimum number of block moves possible.<br>");
    
    instructions.push("Matching:<br><br>User1 Instructions:<br>&emsp;You have to give the other user an instruction to try to match the blocks according to some criterion" + 
        ".<br>&emsp;When you speak, the converted text will show up in the text box.<br>&emsp;After giving the instruction, you and the other user will simultaneously flip " + 
        "two separate blocks. If the blocks match, you should drag both the blocks to the left. If they don’t, the other user will drag both the blocks to the right" + 
        ".<br>&emsp;Once the all the blocks have been dragged to either side, click the end button.<br>&emsp;If one block is left at the end, drag it to your side and " + 
        "click the end button.<br><br>User2 Instructions:<br>&emsp;The other user will give you instructions to complete the task.<br>&emsp;Try to complete it in the " + 
        "minimum number of block moves possible.");
    
    instructions.push("Searching:<br><br>User1 Instructions:<br>&emsp;Select two related words.<br>&emsp;Tell the other user which one of those words you are going to " + 
        "search and which ones they are supposed to search.<br>&emsp;Type in the word in double quotes into the give textbox named “Words”.<br>&emsp;When you speak, " + 
        "the converted text will show up in the text box.<br>&emsp;Try to complete the task in the minimum number of block moves possible.<br>&emsp;Once the task is " + 
        "complete, click the end button.<br>&emsp; Try to complete the task in the minimum number of block moves possible.<br><br>User2 Instructions:<br>&emsp;The other " + 
        "user will give you instructions to complete the task.<br>&emsp;Try to complete it in the minimum number of block moves possible.<br>&emsp;");
    
    instructions.push("Rainbow:<br><br>User1 Instructions:<br>&emsp;You will make a pattern in the separate window labelled “Draw”.<br>&emsp;Then instruct the other user " + 
        "to assist you in replicating the same pattern in the other window.<br>&emsp;Once you have replicated the pattern, click the end button.<br>&emsp;Try to complete " + 
        "the task in the minimum number of block moves possible.<br><br>User2 Instructions:<br>&emsp;<br>&emsp;The other user will give you instructions to complete the " + 
        "task.<br>&emsp;Try to complete it in the minimum number of block moves possible.<br>&emsp;");
}


function initFlipColors() {
    for (var i = 0; i < NumBlocks; i++) {
        x = Math.floor(Math.random() * 5);
        colorMap.set('block' + i, color[x]);
    }
}

function initFlipLetters() {
    for (var i = 0; i < NumBlocks; i++) {
        y = Math.floor(Math.random() * 7);
        letterMap.set('block' + i, letters[y]);
    }
}
function flipBlock(box) {
    swapColor(box);
    swapLetter(box);
}
function swapColor(box) {
    var property = document.getElementById(box);
    var currentColor = property.style.backgroundColor;
    property.style.backgroundColor = colorMap.get(box);
    colorMap.set(box, currentColor);
}
function swapLetter(box) {
    var property = document.getElementById(box);
    var currentLetter = property.textContent || property.innerText;
    property.textContent = letterMap.get(box);
    letterMap.set(box, currentLetter);
}
function incrementGesture() {
    var property = document.getElementById('gestureCount');
    gestureCount++;
    property.innerText = gestureCount;
}

function initTaskID() {
    taskID = Math.floor(Math.random()*4);
    initMetrics();
    
}

function setSearchFieldOne() {
    if(taskID==2){
        document.getElementById("wordsForUser1").style.visibility = "visible";
    }
}

function setSearchFieldTwo() {
    if(taskID==2){
        document.getElementById("wordsForUser2").style.visibility = "visible";
    }
}

function setTaskHeader() {
    document.getElementById("taskQ").innerHTML = "Today, you will have task: " + task[taskID] + "!";
}

function initMetrics() {
    if (taskID == 0) {
        bm = NumBlocks; br = NumBlocks; pn = 1; pp = 10;
        te = (br - actualMove)/(br - bm); ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
        // document.getElementById("taskQ").innerHTML ="Please choose a task\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+ "Bm" + bm + " Br" + br + " Pn" + pn + " P*" + pp + " TE" + te + " IE" + ie + " P" + p;
    } else if (taskID == 1) {
        bm = n1 + n2; br = (n1 + n2) * (NumBlocks + 1) / 2; pn = 1; pp = 10;
        te = (br - actualMove)/(br - bm); ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
        // document.getElementById("taskQ").innerHTML = "Please choose a task\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+ "Bm" + bm + " Br" + br + " Pn" + pn+ " P*" + pp + " TE" + te + " IE" + ie + " P" + p;
    } else if (taskID == 2) {
        bm = NumBlocks; br = 1.5 * 2 * NumBlocks; pn = 2; pp = 20;
        te = (br - actualMove)/(br - bm); ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
        // document.getElementById("taskQ").innerHTML = "Please choose a task\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+ "Bm" + bm + " Br" + br + " Pn" + pn + " P*" + pp + " TE" + te + " IE" + ie + " P" + p;
    } else if (taskID == 3) {
        bm = n1 + n2; br = n1 + factorial(n2 + 1)/Math.pow(2, n2); pn = 2; pp = 20;
        te = (br - actualMove)/(br - bm); ie = (w1 * NumWords + w2 * gestureCount)/bm;
        p = te/ie;
        // document.getElementById("taskQ").innerHTML = "Please choose a task\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0"+ "Bm" + bm + " Br" + br + " Pn" + pn + " P*" + pp + " TE" + te + " IE" + ie + " P" + p;
    }
}

function factorial(x) {
    var c = 1; for (var i = 1; i <= x; i++) {c *= i;}
    return c;
}

function inputlength() {
    var x = document.getElementById("txt_instruction").value;
    if (x.length != 0)
        NumWords = (x.split(" ").length - 1) + 1;
    document.getElementById("numofwords").innerHTML = NumWords;
}

function movement() {
    document.getElementById("showmovement").innerHTML = actualMove;
}

function endGame() {
    return window.stop();
}

// When the user clicks on div, open the popup
function popUpGameIntro() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}

function StartGame() {
    startTime = new Date().getTime();
}

function endGame() {
    endTime = new Date().getTime();
    var time = endTime - startTime;
    for (var i = 0; i < NumBlocks; i++) {
        var blockid = document.getElementById('block'+i);
        if(blockid) {
            if(NumBlocks >= Object.keys(endPosMap).length){
                var pos = blockid.style;
                endPosMap['block'+i] = pos;
            }
        }
    }
    alert('How long you take to finish the task? ' + time/1000 + 's');
    window.close();
}