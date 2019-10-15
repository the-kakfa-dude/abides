#!/usr/bin/env bash
#
# Stops the test database (docker container), and restarts it.
#
# Since sonar and test db are in the same docker-compose.yaml,
# the sonar server will get restarted too.
#
# Whereas the sonar server has persistent storage, and will
# remember its previous state when it boots back up,
# test db does not, and will wake up clean and fresh.
#
# As a result, we will also rerun the setup-db.sh script.


./gradlew composeDown composeUp

sleep 1s
./setup-db.sh

