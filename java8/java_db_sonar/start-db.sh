#!/usr/bin/env bash

nohup 2>&1 docker-compose -f ./docker/postgres/docker-compose.yaml up > ./postgres.log.txt &

