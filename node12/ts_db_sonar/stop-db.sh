#!/usr/bin/env bash

2>&1 docker-compose -f ./docker/postgres/docker-compose.yaml down >> ./postgres.log.txt

