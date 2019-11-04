#!/usr/bin/env bash

./stop-db.sh
sleep 5s 

truncate -s 0 ./postgres.log.txt

./node_modules/.bin/gts clean || rm -rf ./build

rm -rf ./node_modules ./coverage ./.scannerwork ./test-report.xml

docker rm $(docker ps -a | grep 'ts_db_sonar:latest' | awk '{print $NF}')

docker rmi $(docker images | tr -s ' ' | grep 'ts_db_sonar latest' | cut -d' ' -f3)

docker image prune --force

docker volume rm $(docker volume ls | tr -s ' ' | grep '^local postgres_ts_db_sonar' | cut -d' ' -f2)

# starting up docker stuff right after the docker commands
# above can hang unless you git it a little pause between.
#
sleep 1s
exit 0

