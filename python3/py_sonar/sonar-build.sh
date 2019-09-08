#!/usr/bin/env bash

docker build --no-cache --pull -t py_sonar -f docker-sonar/Dockerfile .

