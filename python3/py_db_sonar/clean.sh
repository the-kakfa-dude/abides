#!/usr/bin/env bash

# stop the db and give it time to shut down
./stop-db.sh
sleep 5s

rm -rf ./venv ./py_db_sonar.egg-info

rm -rf ./.pytest_cache ./tests/unit/input_data .coverage ./coverage.xml ./coverage.sonar.xml

rm -rf ./pylint.report

truncate -s 0 ./postgres.log.txt

truncate -s 0 ./sonar.log.txt 

find . -type f | grep pyc$ | xargs rm -f

find . -type d | grep __pycache__ | xargs rm -rf

docker rm $(docker ps -a | grep 'py_db_sonar:latest' | awk '{print $NF}')

docker rmi $(docker images | tr -s ' ' | grep 'py_db_sonar latest' | cut -d' ' -f3)

docker image prune --force

docker volume rm $(docker volume ls | tr -s ' ' | grep '^local postgres_py_db_sonar' | cut -d' ' -f2)

exit 0
