#!/bin/sh

PIP="pip3"

$PIP install -r requirements.txt
npm install protractor

# See comment below
touch node_modules/protractor/node_modules/webdriver-manager/selenium/update-config.json \
    || node_modules/protractor/bin/webdriver-manager update --standalone

cd 2D\ Simulation
npm install


# The geckodriver (the one that is used by Firefox) gets pulled
# directly from GitHub on each build, and eventually we hit the rate
# limit. As such, it is currently set up on travis to cache the
# node_modules folder where the driver can live in between
# builds. After an initial download we need to touch the (already
# existing) file to ensure it's date of creation was withing the last
# hour so as not to ping GitHub
# (https://github.com/angular/webdriver-manager/issues/270). Otherwise,
# we run the update and get a fresh copy.
