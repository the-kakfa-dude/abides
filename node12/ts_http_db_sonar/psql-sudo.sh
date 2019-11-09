#!/usr/bin/env bash

PGPORT=5433 PGPASSWORD=ts_http_db_sonar_sudo psql -h localhost -U postgres "$@"

