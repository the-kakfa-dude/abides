#!/usr/bin/env bash

PGPORT=5433 PGPASSWORD=py_db_sonar_pass psql -U py_db_sonar_user -h localhost -d py_db_sonar "$@"

