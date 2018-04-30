function timecounter() {
    var countDownDate = new Date().getTime() + 1000 * 3 * 60 * 1000 + 1000;

    var x = setInterval(function() {
        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / 60000);
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (minutes < 0) {
            clearInterval(x);
            endGame();
        } else {
            $("#timer").html(minutes + ":" + padTens(seconds));
        }

    }, 1000);
}

function padTens(num, length) {
    if (num >= 10)
        return "" + num;
    else
        return "0" + num;
}
