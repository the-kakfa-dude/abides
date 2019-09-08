#!/usr/bin/env bash

docker run -t --rm py_sonar:latest python -m py_sonar.main --make continuously-driving --model container

