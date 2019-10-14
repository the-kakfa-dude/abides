import sqlalchemy

DRIVER = 'postgresql+psycopg2'
USER = 'py_db_sonar_user'
PASSWORD = 'py_db_sonar_pass'
SERVER = 'localhost'
PORT = 5432
DATABASE = 'py_db_sonar'
POSTGRES_URL = f'{DRIVER}://{USER}:{PASSWORD}@{SERVER}:{PORT}/{DATABASE}'

# set echo to True if you want sqlalchemy log output to standard out
DB_ENGINE = sqlalchemy.create_engine(POSTGRES_URL, echo=False)
