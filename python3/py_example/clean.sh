#!/usr/bin/env bash

rm -rf ./venv

rm -rf ./py_example.egg-info

rm -rf ./.pytest_cache

rm -rf ./tests/input_data

find . -type f | grep pyc$ | xargs rm -f

find . -type d | grep __pycache__ | xargs rm -rf

docker rm $(docker ps -a | grep 'py_example:latest' | awk '{print $NF}')

docker rmi $(docker images | tr -s ' ' | grep 'py_example latest' | cut -d' ' -f3)

docker image prune --force



