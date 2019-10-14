#!/usr/bin/env bash

# make sure the test database has started, cuz on a fresh docker, it can be slow.
#
# we  will set up the db later.
#
./start-db.sh

# build the docker file.
#
docker build --no-cache --pull -t py_db_sonar -f docker/Dockerfile .

# lint the code
#
docker run -t --rm py_db_sonar:latest flake8 .
docker run -t --rm py_db_sonar:latest pylint py_db_sonar tests functional_tests

# run the unit tests
#
docker run -t --rm py_db_sonar:latest py.test tests

# reset the db, in case it was left full of kruft
#
./reset-db.sh

# run the functional tests, but reset the test database first
# in case they didn't clean up properly last time.
#
docker run --network host -t --rm py_db_sonar:latest py.test functional_tests

