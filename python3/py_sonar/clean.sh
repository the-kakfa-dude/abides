#!/usr/bin/env bash

rm -rf ./venv ./py_sonar.egg-info

rm -rf ./.pytest_cache ./tests/input_data .coverage ./coverage.xml ./coverage.sonar.xml ./sonar.log.txt

rm -rf ./pylint.report

find . -type f | grep pyc$ | xargs rm -f

find . -type d | grep __pycache__ | xargs rm -rf

docker rm $(docker ps -a | grep 'py_sonar:latest' | awk '{print $NF}')

docker rmi $(docker images | tr -s ' ' | grep 'py_sonar latest' | cut -d' ' -f3)

docker rmi $(docker images | tr -s ' ' | grep 'py_sonar_scanner latest' | cut -d' ' -f3)

docker image prune --force

