CREATE ROLE py_db_sonar_user WITH LOGIN CREATEDB CREATEROLE PASSWORD 'py_db_sonar_pass'
;

CREATE DATABASE py_db_sonar
;

GRANT ALL PRIVILEGES ON DATABASE py_db_sonar TO py_db_sonar_user
;

