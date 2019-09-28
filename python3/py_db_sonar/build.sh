#!/usr/bin/env bash

# the first time this runs, it needs extra time for the postgres image to download,
# so start it now.
#
2>&1 ./start-db.sh > /dev/null

# quietly deactivate any previously active virtual environment.
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
pylint py_db_sonar tests functional_tests -r n --msg-template="{path}:{line}: [{msg_id}({symbol}), {obj}] {msg}" | tee ./pylint.report

# we also send sonar the test coverage report.
#
pytest --cov-report xml --cov=py_db_sonar tests

# setup the test db.
#
./reset-db.sh

# run the functional tests
#
pytest --cov-report xml --cov=py_db_sonar --cov-append functional_tests

# make the coverage report look like it was created in the sonar scanner container.
#
cat coverage.xml | sed "s|$(pwd)|/app|g" > coverage.sonar.xml

