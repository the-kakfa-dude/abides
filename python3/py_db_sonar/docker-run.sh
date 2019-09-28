#!/usr/bin/env bash

docker run --network host -t --rm py_db_sonar:latest  python -m py_db_sonar.main --make continuously-driving --model container

