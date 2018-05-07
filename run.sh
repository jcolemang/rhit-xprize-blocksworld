#!/bin/sh

PYTHON="python3"

cd server
$PYTHON simulation.py &

sleep 10

cd ../2D\ Simulation
$PYTHON -m http.server &
