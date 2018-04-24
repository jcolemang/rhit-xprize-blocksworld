var redirects = (function() {
    let r = {};

    r.pageDown = (err) => {
        console.log('Error: ' + err);
        // We use a timeout to not override a refresh
        setTimeout(() => window.location.href = "server_down.html", 1000);
    };

    return r;
})();
