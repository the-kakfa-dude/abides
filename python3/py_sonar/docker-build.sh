#!/usr/bin/env bash

docker build --no-cache --pull -t py_sonar -f docker/Dockerfile .

docker run -t --rm py_sonar:latest flake8 .

docker run -t --rm py_sonar:latest pylint py_sonar

docker run -t --rm py_sonar:latest py.test

