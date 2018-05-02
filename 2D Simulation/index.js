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
var x;
var y;
var br; var bm; var pn; var pp; var p; var te; var ie;
var start_button_pressed = false;
var end_top = [];
var end_left = [];
var initialScore = -1;

// I am certain that these are necessary as of Sunday, October 29
var currentConfig;
var finalBlocks;
var initialInfo = [];
var standard_info = [];

function writeBlockStyles(config) {
    for (let i = 0; i < config.length; i++) {
        let block = $("#block" + i);
        block.css({
            width: "3.8%",
            height: "7.35%",
            backgroundColor: config[i].topColor,
            border: "#000 solid 4px",
            position: "absolute",
            zIndex: 1,
            textAlign: "center",
            verticalAlign: "middle",
            lineHeight: "7.35%",
            fontFamily: "'Corben', Georgia, Times, Serif",
            cursor: "default"
        });
    }
}

function flipBlock(block_id, letter, color, config) {
    blocks.flip_block(block_id.substring(5));
    document.getElementById("gestureToggle").style.visibility = "hidden";
    actualMove++;
    hide_gesture();

    let rect = document.getElementById('container').getBoundingClientRect();
    let horiz = $("#" + block_id).position().left / (rect.right - rect.left - 16) * 100;
    let vert = $("#" + block_id).position().top / (rect.bottom - rect.top - 16) * 100;

    movesTracker.add_flip(block_id, letter, color, horiz, vert);
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

        movesTracker.add_instruction(text);
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
    let goal_left = finalBlocks.map(block => block.left);
    let goal_top = finalBlocks.map(block => block.top);

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
