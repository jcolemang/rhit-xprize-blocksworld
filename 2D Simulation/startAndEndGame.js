let _startTime = new Date().getTime();

function startGame() {
    start_button_pressed = true;
    timecounter();
    document.getElementById("showChosen").style.visibility = "visible";
    setUpInitialPosition(currentConfig, finalBlocks);
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

function setUpInitialPosition(currentConfig, finalBlocks) {
    for (let i = 0; i < currentConfig.length; i++) {
        var tLeft = 0;
        var tTop = 0;

        var horizontal_percent = (document.getElementById('container').getBoundingClientRect().right - 50 - 8 - 4 - 4) / document.getElementById('container').getBoundingClientRect().right * 100;
        var vertical_percent = (document.getElementById('container').getBoundingClientRect().bottom - 50 - 8 - 4 - 4) / document.getElementById('container').getBoundingClientRect().bottom * 100;

        tLeft = Math.random() * Math.floor(horizontal_percent);
        tTop = Math.random() * Math.floor(vertical_percent);

        end_left.push(tLeft);
        end_top.push(tTop);

        initialInfo.push("block:" + i + " " +
                         "initial position: (" + tLeft + "%, " + tTop + "%) " +
                         "color: " + currentConfig[i].topColor +
                         " letters: " + currentConfig[i].topLetter +
                         " flipletters: " + currentConfig[i].bottomLetter);
        document.getElementById("block" + i).style.top = tTop+"%";
        document.getElementById("block" + i).style.left = tLeft+"%";
    }

    document.getElementById('scoreBox').innerText = Math.round(scoreCal(finalBlocks));
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

        var words = "Construction: Rainbow0.png";

        alert('Time you took to finish the task? ' + minutes + "minutes, " + Math.floor(seconds) + "seconds");

        try {
            socket.emit('end_button_pressed', {
                startTime: _startTime,
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
