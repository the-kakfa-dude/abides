FROM python:3.7

RUN apt-get update
RUN apt-get install -y postgresql-client

ADD . /py_db_sonar

WORKDIR /py_db_sonar
RUN pip install -e .

