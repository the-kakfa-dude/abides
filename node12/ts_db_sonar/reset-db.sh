#!/usr/bin/env bash
#
# Stops the postgres database (docker container),
# deletes it, erases the storage so it comes up blank,
# starts it up and then runs the setup script on it.
#
# If you see complaints about things already existing,
# then the database container failed to stop, or the 
# volumes didn't get deleted.
#
# To force it to go down, run these:
#
#    docker stop postgres_test_db_1
#    docker rm -v postgres_test_db_1
#
# and then run this script again.
#
# If it keeps happening (docker can be like that)
# increase the 2 sleeps below, and try again.
#

# stop the database container
#
# docker needs a couple of seconds to take down the postgres network
#
./stop-db.sh
sleep 5s

# remove the persistent storage, so the database comes up blank
#
docker volume rm -f postgres_ts_db_sonar
docker volume rm -f postgres_ts_db_sonar_data

# start it up again
#
# the init.sql at the docker entry point dir should take care of db setup
#
./start-db.sh
sleep 5s

# the db is now blank, so create the tables again.
#
# compile the code first to pick up any recent typeorm changes.
#
npm run compile
npm run migration:run

# git it a sec
#
sleep 1s

