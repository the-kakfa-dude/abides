#!/usr/bin/env bash

2>&1 docker-compose -f ./docker/sonar/docker-compose.yaml down >> ./sonar.log.txt

