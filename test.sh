#!/bin/sh

PYTHON="python3"

function server_tests {
    cd server

    $PYTHON -m pytest . --ignore=rhit-xprize-neural-network
    return $?
}

function client_tests {
    cd ../2D\ Simulation

    npx jasmine
    return $?
}

function gui_tests {
    node_modules/protractor/bin/webdriver-manager start \
                                                  --versions.gecko v0.20.1 &
    WEBDRIVER_PID=$!

    cd ../server
    $PYTHON simulation.py &
    SIMULATION_PID=$!

    cd ../2D\ Simulation
    $PYTHON -m http.server &
    SERVER_PID=$!

    sleep 5

    npx protractor conf.js
    PROTRACTOR_RESULT=$?

    kill $WEBDRIVER_PID
    kill $SIMULATION_PID
    kill $SERVER_PID

    return $PROTRACTOR_RESULT
}

server_tests && client_tests && gui_tests
