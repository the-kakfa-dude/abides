#!/usr/bin/env bash

docker build --no-cache --pull -t py_sonar_scanner -f docker-sonar/Dockerfile .

