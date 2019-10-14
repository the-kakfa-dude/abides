#!/usr/bin/env bash

. ./venv/bin/activate

python -m py_db_sonar.main --make self-driving --model fantasy-land
