#!/usr/bin/env bash

PGPASSWORD=py_db_sonar_sudo psql -h localhost -U postgres "$@"

