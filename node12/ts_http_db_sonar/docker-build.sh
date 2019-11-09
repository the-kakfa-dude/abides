#!/usr/bin/env bash

./reset-db.sh

docker build --no-cache --pull -t ts_http_db_sonar -f docker/Dockerfile .

docker run -t --rm ts_http_db_sonar:latest ./check.sh

docker run -t --rm ts_http_db_sonar:latest npm run unittest

docker run --network host -t --rm ts_http_db_sonar:latest npm run functest

