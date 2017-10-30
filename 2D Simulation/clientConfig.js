
let config = (function(local) {
    let config = {};

    if (local) {
        config.appServer = 'http://localhost';
        config.appPort = 8080;
        config.surveyServer = 'http://localhost';
        config.surveyPort = 8081;
    } else {
        // config.server = 'https://blockworld.rose-hulman.edu:8080';
        // config.surveyServer = "https://blockworld.rose-hulman.edu:8081";
    }

    config.appAddr = config.appServer + ':' + config.appPort;
    config.surveyAddr = config.surveyServer + ':' + config.surveyPort;
    return config;
})(true);

console.log(config);
