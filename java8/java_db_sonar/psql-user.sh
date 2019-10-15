#!/usr/bin/env bash

PGPORT=5433 PGPASSWORD=java_db_sonar_pass psql -U java_db_sonar_user -h localhost -d java_db_sonar "$@"

