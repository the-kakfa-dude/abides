#!/usr/bin/env bash

nohup 2>&1 docker-compose -f ./docker/sonar/docker-compose.yaml up > ./sonar.log.txt &

