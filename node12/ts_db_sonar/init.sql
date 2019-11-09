CREATE ROLE ts_db_sonar_user WITH LOGIN CREATEDB CREATEROLE PASSWORD 'ts_db_sonar_pass'
;

CREATE DATABASE ts_db_sonar
;

GRANT ALL PRIVILEGES ON DATABASE ts_db_sonar TO ts_db_sonar_user
;

