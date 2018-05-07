let _startTime = new Date().getTime();

function startGame() {
    start_button_pressed = true;
    timecounter();
    document.getElementById("showChosen").style.visibility = "visible";
    setUpInitialPosition(currentConfig, finalBlocks);
    document.getElementById("buttonEnd").disabled = false;
    document.getElementById("buttonEnter").disabled = false;
    document.getElementById('txt_instruction').disabled = false;

    document.getElementById('container').ondblclick = function(event) {
        gesture.set_position(event.pageX, event.pageY);
    };

    actualMove = 0;
    gesture.hide();

    document.getElementById('buttonStart').disabled = true;
}

function setUpInitialPosition(currentConfig, finalBlocks) {
    for (let i = 0; i < currentConfig.length; i++) {
        initialInfo.push("block:" + i + " " +
                         "initial position: (" + currentConfig[i].left + "%, "
                         + currentConfig[i].top + "%) " +
                         "color: " + currentConfig[i].topColor +
                         " letters: " + currentConfig[i].topLetter +
                         " flipletters: " + currentConfig[i].bottomLetter);
    }

    scoring.set_initial_score();
    document.getElementById('scoreBox').innerText
        = Math.round(scoring.calc_score());
}

function endGame() {
    if (start_button_pressed) {
        let endTime = new Date().getTime();
        // stopRecording();
        let time = endTime - _startTime;
        time = time / 1000; // Convert to seconds.

        var minutes = Math.floor(time / 60);
        var seconds = time - (minutes * 60);

        let actions = movesTracker.export_actions();

        calculateBackEndData();

        var words = "Construction: Rainbow0.png";

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
                finalScore: Math.round(scoring.calc_score()),
                seconds: seconds
            });
        } catch (err) {
            redirects.pageDown(err);
        }

        document.body.innerHTML = '';
        document.documentElement.innerHTML = "";
        document.body.innerHTML += "<h2 style=\"font-family:verdana\"> Thank you for participating the game. Please take a few seconds to complete this survey.</h2>	<p id = \"question1\" style=\"font-family:verdana\">1. Please provide any feedback you have about the game, or type \"None\" if you don't have any.</p>	<textarea id = \"q1\" rows=\"4\" cols=\"50\"></textarea><br>";

        document.body.innerHTML += "<button class = \"Finishbutton\" style = \"background-image: url(img/startbutton.png); width: 68px; height: 40px;\" onclick=\"submit()\">Submit</button>";
    }
}

function submit() {
    var q1 = "", q2 = "", q3 = "", q4 = -1, q5 = -1, q6 = -1;
    q1 = document.getElementById("q1").value;

    if (q1 == "") {
        document.getElementById("question1").style = "width: 680px; color: red; background-color:rgb(255,204,204);font-family:verdana";
        document.getElementById("require").style.visibility = "visible";

        document.getElementById("q1").innerText = q1;
    } else {
        try {
            socket.emit('send_survey_data_to_server', {
                q1: q1,
                q2: q2,
                q3: q3,
                q4: q4,
                q5: q5,
                q6: q6
            });
        } catch (err) {
            redirects.pageDown(err);
        }
        window.location.href = "finalPage.html";
    }
}
