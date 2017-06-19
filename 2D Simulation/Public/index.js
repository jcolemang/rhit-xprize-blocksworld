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
var introductions = [];
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
var room_id = "";

var leave_message = "Note: If you refresh or leave the page, you and your partner " + 
					"will be disconnected, all your progress will be lost, and you " + 
					"will have to enter another instance of the game. Do you wish to " + 
					"continue?"

function initInstructions() {
    task.push("Sorting");
    task.push("Matching");
    task.push("Searching");
    task.push("Rainbow");
    introductions.push("Sorting:<br><br>User1 Instructions:<br>&emsp;You have to give the other user an instruction to sort the blocks in a particular way." +
        "<br>&emsp;When you speak, the converted text will show up in the text box.<br>Once the task is complete, click the end button.<br><br>User2 " +
        "Instructions:<br>&emsp;The other user will give you instructions to complete the task.<br>&emsp;Try to complete it in the minimum number of block moves possible.<br>");

    introductions.push("Matching:<br><br>User1 Instructions:<br>&emsp;You have to give the other user an instruction to try to match the blocks according to some criterion" +
        ".<br>&emsp;When you speak, the converted text will show up in the text box.<br>&emsp;After giving the instruction, you and the other user will simultaneously flip " +
        "two separate blocks. If the blocks match, you should drag both the blocks to the left. If they don’t, the other user will drag both the blocks to the right" +
        ".<br>&emsp;Once the all the blocks have been dragged to either side, click the end button.<br>&emsp;If one block is left at the end, drag it to your side and " +
        "click the end button.<br><br>User2 Instructions:<br>&emsp;The other user will give you instructions to complete the task.<br>&emsp;Try to complete it in the " +
        "minimum number of block moves possible.");

    introductions.push("Searching:<br><br>User1 Instructions:<br>&emsp;Select two related words.<br>&emsp;Tell the other user which one of those words you are going to " +
        "search and which ones they are supposed to search.<br>&emsp;Type in the word in double quotes into the give textbox named “Words”.<br>&emsp;When you speak, " +
        "the converted text will show up in the text box.<br>&emsp;Try to complete the task in the minimum number of block moves possible.<br>&emsp;Once the task is " +
        "complete, click the end button.<br>&emsp; Try to complete the task in the minimum number of block moves possible.<br><br>User2 Instructions:<br>&emsp;The other " +
        "user will give you instructions to complete the task.<br>&emsp;Try to complete it in the minimum number of block moves possible.<br>&emsp;");

    introductions.push("Rainbow:<br><br>User1 Instructions:<br>&emsp;You will make a pattern in the separate window labelled “Draw”.<br>&emsp;Then instruct the other user " +
        "to assist you in replicating the same pattern in the other window.<br>&emsp;Once you have replicated the pattern, click the end button.<br>&emsp;Try to complete " +
        "the task in the minimum number of block moves possible.<br><br>User2 Instructions:<br>&emsp;<br>&emsp;The other user will give you instructions to complete the " +

        "task.<br>&emsp;Try to complete it in the minimum number of block moves possible.<br>&emsp;");
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

// function setGesture() {
//     var event = e || window.event;
//     var property = document.getElementById('gestureCount');
//     property.innerText = gestureCount;
//     var gestureElement = document.getElementById("gestureToggle");
//     gestureElement.style.left = event.clientX+'px';
//     gestureElement.style.top = event.clientY+'px';
//     gestureElement.style.visibility = "visible";
// }

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

function setSearchFieldOne() {
    if(taskID==2){
        document.getElementById("wordsForUser1").style.visibility = "visible";
    } else {
        document.getElementById("wordsForUser1").style.visibility = "hidden";
    }
}

function setSearchFieldTwo() {
    if(taskID==2){
        document.getElementById("wordsForUser2").style.visibility = "visible";
    } else {
        document.getElementById("wordsForUser2").style.visibility = "hidden";
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
    // document.getElementById("user_message").innerHTML = numToAdd;

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

function StartGame() {
    startTime = new Date().getTime();
}

function endGame() {
    endTime = new Date().getTime();
    time = endTime - startTime;
    for (var i = 0; i < NumBlocks; i++) {
        var blockid = document.getElementById('block'+i);
        if(blockid) {
            if(NumBlocks >= Object.keys(endPosMap).length){
                var pos = blockid.style;
                endPosMap['block'+i] = pos;
            }
        }
    }
    for (var i = 0; i < start.length;i++) {
        console.log(type[i]+" "+start[i]+" "+end[i]+" "+interval[i]);
    }

    console.log(instructions);
    alert('How long you take to finish the task? ' + time/1000 + 's');
    document.body.innerHTML = '';
    document.documentElement.innerHTML = 'Good job!';
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
