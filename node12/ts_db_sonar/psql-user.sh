#!/usr/bin/env bash

PGPORT=5433 PGPASSWORD=ts_db_sonar_pass psql -U ts_db_sonar_user -h localhost -d ts_db_sonar "$@"

