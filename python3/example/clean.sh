#!/usr/bin/env bash

rm -rf ./venv

rm -rf ./example.egg-info

rm -rf ./.pytest_cache

rm -rf ./tests/input_data

find . -type f | grep pyc$ | xargs rm -f

find . -type d | grep __pycache__ | xargs rm -rf

docker ps -a | grep 'example:latest' | awk '{print $NF}' | xargs docker rm

docker images | tr -s ' ' | grep 'example latest' | cut -d' ' -f3 | xargs docker rmi

docker image prune --force
