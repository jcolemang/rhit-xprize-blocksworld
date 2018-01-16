var fs = require('fs');

let generateConfig = function(local) {
    let config = {};

    config.isLocal = local;
    config.serverPort = 8080;
    config.serverAddr = '0.0.0.0';
    config.verifyPort = 8081;
    config.verifyAddr = '0.0.0.0';

    if (local) {
        config.pgConString = "pg://postgres:player@127.0.0.1:5432/aixprize";
        config.addr = "http://127.0.0.1:8080";
        config.serverOptions = {};
    }
    else {
        config.pgConString = "pg://postgres:bgoyt6@137.112.92.17:5432/AIxprize";
        config.addr = "https://blockworld.rose-hulman.edu:8080";
        config.serverOptions = {
            key: fs.readFileSync('/etc/ssl/private/ibm-mvpsim.key'),
            cert: fs.readFileSync('/etc/ssl/ibm-mvpsimulator_rose-hulman_edu_cert.cer')
        };
    }

    return config;
};

module.exports = generateConfig;
