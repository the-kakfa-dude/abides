#!/usr/bin/env bash

./node_modules/.bin/gts clean || rm -rf ./build

rm -rf ./node_modules ./coverage

docker rm $(docker ps -a | grep 'ts_example:latest' | awk '{print $NF}')

docker rmi $(docker images | tr -s ' ' | grep 'ts_example latest' | cut -d' ' -f3)

docker image prune --force

# starting up docker stuff right after the docker commands
# above can hang unless you git it a little pause between.
sleep 1s

