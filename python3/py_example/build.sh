#!/usr/bin/env bash


2>&1 deactivate | grep -v 'deactivate: command not found'

rm -rf ./venv
python3 -m venv ./venv

. ./venv/bin/activate
pip install -e .

flake8

pylint py_example -d C0111

pytest
