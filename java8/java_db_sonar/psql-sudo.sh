#!/usr/bin/env bash

PGPORT=5433 PGPASSWORD=java_db_sonar_sudo psql -h localhost -U postgres "$@"

