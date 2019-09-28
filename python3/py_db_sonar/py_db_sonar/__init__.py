import sqlalchemy

POSTGRES_URL = 'postgresql+psycopg2://py_db_sonar_user:py_db_sonar_pass@localhost:5432/py_db_sonar'

# set echo to True if you want sqlalchemy log output to standard out
DB_ENGINE = sqlalchemy.create_engine(POSTGRES_URL, echo=False)
