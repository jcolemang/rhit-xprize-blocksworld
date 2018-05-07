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
    actualMove++;
    gesture.hide();

    let rect = document.getElementById('container').getBoundingClientRect();
    let horiz = $("#" + block_id).position().left / (rect.right - rect.left - 16) * 100;
    let vert = $("#" + block_id).position().top / (rect.bottom - rect.top - 16) * 100;

    movesTracker.add_flip(block_id, instructionstarttime, letter, color, horiz, vert);
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

function toggle_construction() {
    if (this.is_visible === undefined)
        this.is_visible = true;

    if (this.is_visible) {
        $('.ghost_block').css('visibility', 'hidden');
        $('#constructionToggle').text('Show Construction');
    } else {
        $('.ghost_block').css('visibility', 'visible');
        $('#constructionToggle').text('Hide Construction');
    }

    this.is_visible = !this.is_visible;
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
