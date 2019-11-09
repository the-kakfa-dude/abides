#!/usr/bin/env bash

./start-db.sh
sleep 5s

npm install

npm outdated

./check.sh

npm run compile

npm run migration:run

# run the two test types toghether.
# if you run them one a time,
# sonar will only report the last one.
#
npm run test

