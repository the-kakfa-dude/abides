#!/usr/bin/env bash

docker build --no-cache -t example -f docker/Dockerfile .

docker run -t --rm example:latest flake8 .

docker run -t --rm example:latest py.test
