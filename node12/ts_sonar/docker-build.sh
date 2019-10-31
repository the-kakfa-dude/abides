#!/usr/bin/env bash

docker build --no-cache --pull -t ts_sonar -f docker/Dockerfile .

docker run -t --rm ts_sonar:latest ./check.sh

docker run -t --rm ts_sonar:latest npm test

