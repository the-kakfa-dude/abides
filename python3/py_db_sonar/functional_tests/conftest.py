import pytest
import sqlalchemy

from sqlalchemy.orm import sessionmaker

from py_db_sonar import DB_ENGINE
from py_db_sonar.bike import Bike
from py_db_sonar.car import Car


@pytest.fixture
def bat_mobile() -> Car:
    return Car("bat", "mobile")


@pytest.fixture
def crashed_bat_mobile() -> Car:
    return Car("bat", "murcielago")


@pytest.fixture
def crashed_hangover_benz() -> Car:
    return Car("mercedes-benz", "hangover")


@pytest.fixture
def schwinn() -> Bike:
    return Bike('schwinn', False)


@pytest.fixture
def trek() -> Bike:
    return Bike('trek', False)


@pytest.fixture
def diamondback() -> Bike:
    return Bike('diamondback', True)


@pytest.fixture(scope="session")
def db_engine() -> object:
    return DB_ENGINE


@pytest.fixture(scope="session")
def db_connection(db_engine) -> sqlalchemy.engine.Connection:

    # do a setup and tear down, via yield instead of return
    connection = db_engine.connect()
    return connection


@pytest.fixture(scope="session")
def db_metadata(db_engine) -> sqlalchemy.MetaData:
    result = sqlalchemy.MetaData(bind=db_engine)
    return result


@pytest.fixture(scope="session")
def cars_table(db_engine, db_metadata) -> sqlalchemy.Table:

    # create a table for cars using non-orm syntax
    table = sqlalchemy.Table('cars',
                             db_metadata,
                             sqlalchemy.Column('make', sqlalchemy.String(255), nullable=False),
                             sqlalchemy.Column('model', sqlalchemy.String(255), nullable=False),
                             sqlalchemy.Column('junker', sqlalchemy.Boolean(), default=True))
    table.create(db_engine)
    return table


@pytest.fixture(scope='session')
def db_session_maker(db_engine):

    # the Session class you see in sqlalchemy orm doc is actually returned by a function,
    # which is great because all the IDEs and linters complain about it not being lowercase.
    session = sessionmaker()
    session.configure(bind=db_engine)
    return session
