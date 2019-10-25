CREATE ROLE java_db_sonar_user WITH LOGIN CREATEDB CREATEROLE PASSWORD 'java_db_sonar_pass'
;

CREATE DATABASE java_db_sonar
;

GRANT ALL PRIVILEGES ON DATABASE java_db_sonar TO java_db_sonar_user
;

