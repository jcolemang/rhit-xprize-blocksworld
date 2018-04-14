let _startTime = new Date().getTime();

function startGame() {
    start_button_pressed = true;
    timecounter();
    document.getElementById("showChosen").style.visibility = "visible";
    setUpInitialPosition(blockColors, flipColorArray, blockLetters, flipLetterArray, finalBlocks);
    document.getElementById("buttonEnd").disabled = false;
    document.getElementById("buttonEnter").disabled = false;
    document.getElementById('txt_instruction').disabled = false;

    document.getElementById('container').ondblclick = function(e) {
        var event = e || window.event;

        setGestureWithPosition(event.clientX, event.clientY, event);
    };

    actualMove = 0;
    hide_gesture();

    document.getElementById('buttonStart').disabled = true;
}

function endGame() {
    if (start_button_pressed) {
        let endTime = new Date().getTime();
        // stopRecording();
        let time = endTime - _startTime;
        time = time / 1000; // Convert to seconds.

        var minutes = Math.floor(time / 60);
        var seconds = time - (minutes * 60);

        for (var i = 0; i < NumBlocks; i++) {
            var blockid = document.getElementById('block'+i);
            if(blockid) {
                end_top.push($("#block" + i).data("vertical_percent"));
                end_left.push($("#block" + i).data("horizontal_percent"));
            }
        }

        let actions = movesTracker.export_actions();

        calculateBackEndData();

        var words = "";

        words = "Construction: Rainbow" + rainbow_select + ".png";

        alert('Time you took to finish the task? ' + minutes + "minutes, " + Math.floor(seconds) + "seconds");

        try {
            socket.emit('end_button_pressed', {
                time: time,
                task: "Construction",
                W: NumWords,
                G: gestureCount,
                b: actualMove,
                bm: bm,
                br: br,
                pn: pn,
                pp: pp,
                te: te,
                ie: ie,
                p: p,
                Action: actions,
                initialInfo: initialInfo,
                standard_info: standard_info,
                other: words,
                minutes: minutes,
                finalScore: Math.round(scoreCal(finalBlocks)),
                seconds: seconds
            });
        } catch (err) {
            /* window.location.href = "server_down.html";*/
            redirects.pageDown(err);
        }

        document.body.innerHTML = '';
        document.documentElement.innerHTML = "";
        document.body.innerHTML += "<h2 style=\"font-family:verdana\"> Thank you for participating the game. Please take a few seconds to complete this survey.</h2>	<p id = \"question1\" style=\"font-family:verdana\">1. Please provide any feedback you have about the game, or type \"None\" if you don't have any.</p>	<textarea id = \"q1\" rows=\"4\" cols=\"50\"></textarea><br>";

        // document.body.innerHTML += "<p id = \"question4\" style=\"font-family:verdana\">4. How difficult was it to complete the task?</p>	<input type=\"radio\" name=\"1\" id = \"41\" value=\"1 (very easy)\"> (very easy) 1	<input type=\"radio\" name=\"1\" id = \"42\" value=\"2\"> 2	<input type=\"radio\" name=\"1\" id = \"43\" value=\"3\"> 3	<input type=\"radio\" name=\"1\" id = \"44\" value=\"4\"> 4	<input type=\"radio\" name=\"1\" id = \"45\" value=\"5\"> 5	<input type=\"radio\" name=\"1\" id = \"46\" value=\"6\"> 6	<input type=\"radio\" name=\"1\" id = \"47\" value=\"7 (very dificult)\"> 7 (very dificult)";

        // document.body.innerHTML += "<p id = \"question5\" style=\"font-family:verdana\">5. How helpful did you find your partner? </p>	<input type=\"radio\" name=\"2\" id = \"51\" value=\"1 (not helpful at all)\"> (not helpful at all) 1	<input type=\"radio\" name=\"2\" id = \"52\" value=\"22\"> 2	<input type=\"radio\" name=\"2\" id = \"53\" value=\"33\"> 3	<input type=\"radio\" name=\"2\" id = \"54\" value=\"44\"> 4	<input type=\"radio\" name=\"2\" id = \"55\" value=\"55\"> 5	<input type=\"radio\" name=\"2\" id = \"56\" value=\"66\"> 6	<input type=\"radio\" name=\"2\" id = \"57\" value=\"7 (very helpful)\"> 7 (very helpful)";

        // document.body.innerHTML += "<p id = \"question6\" style=\"font-family:verdana\">6. How much more difficult would this task have been if you had to do it on your own, without a partner?</p>	<input type=\"radio\" name=\"3\" id = \"61\" value=\"1 (much easier)\"> (much easier) 1	<input type=\"radio\" name=\"3\" id = \"62\" value=\"222\"> 2	<input type=\"radio\" name=\"3\" id = \"63\" value=\"333\"> 3	<input type=\"radio\" name=\"3\" id = \"64\" value=\"444\"> 4	<input type=\"radio\" name=\"3\" id = \"65\" value=\"555\"> 5	<input type=\"radio\" name=\"3\" id = \"66\" value=\"666\"> 6	<input type=\"radio\" name=\"3\" id = \"67\" value=\"7 (much more difficult)\"> 7 (much more difficult)	<br><br>";

        document.body.innerHTML += "<button class = \"Finishbutton\" style = \"background-image: url(img/startbutton.png); width: 68px; height: 40px;\" onclick=\"submit()\">Submit</button>";
    }
}
