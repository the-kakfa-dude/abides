#!/usr/bin/env bash

docker build --no-cache --pull -t ts_example -f docker/Dockerfile .

docker run -t --rm ts_example:latest ./check.sh

docker run -t --rm ts_example:latest npm test

