#!/usr/bin/env bash

docker build --no-cache --pull -t py_example -f docker/Dockerfile .

docker run -t --rm py_example:latest flake8 .

docker run -t --rm py_example:latest pylint py_example -d C0111

docker run -t --rm py_example:latest py.test
