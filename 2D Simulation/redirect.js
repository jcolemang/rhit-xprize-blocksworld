var redirects = (function() {
    let r = {};

    r.pageDown = (err) => {
        console.log('Error: ' + err);
        window.location.href = "server_down.html";
    };

    return r;
})();
