#!/usr/bin/env bash

# quietyly deactivate any previously active virtual environment.
#
2>&1 deactivate | grep -v 'deactivate: command not found'

# nuke the old virtual environment, and make a new one.
#
rm -rf ./venv
python3 -m venv ./venv

# install our stuff in this new virtual environment.
#
. ./venv/bin/activate
pip install -e .

# flake8 gives some great python syntax police info.
#
flake8

# so does pylint, which is what we send to sonar.
#
# the magic formatting mumbo-jumbo makes sonar happy.
#
pylint py_sonar -r n --msg-template="{path}:{line}: [{msg_id}({symbol}), {obj}] {msg}" | tee ./pylint.report
pylint tests    -r n --msg-template="{path}:{line}: [{msg_id}({symbol}), {obj}] {msg}" | tee -a ./pylint.report

# we also send sonar the test coverage report.
#
pytest --cov-report xml --cov=py_sonar tests/

# we which need to make look like it was run in the container.
#
cat coverage.xml | sed "s|$(pwd)|/app|g" > coverage.sonar.xml

