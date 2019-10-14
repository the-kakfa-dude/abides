"""
This file tests the non-ORM aspect of our example sqlalchemy, namely the cars table.
"""
import sqlalchemy

from py_db_sonar.bike import Bike
from py_db_sonar.orm.bikes import BikesTable


def to_list_of_dict(result_proxy) -> list:

    # this assumes you actually like the interface you get
    # when a RowProxy object turns a row into a dictionary.
    return [dict(row) for row in result_proxy]


def add_bike_and_commit(session, bike: Bike):
    session.add(BikesTable(name=bike.get_name(), bmx=bike.is_bmx()))
    session.commit()


def test_insert(db_session_maker, schwinn, trek, diamondback):
    """
    Validates that we can insert into the bikes table.

    :return: there is no return from this method.
    """

    db_session = db_session_maker()
    try:
        add_bike_and_commit(db_session, schwinn)
        add_bike_and_commit(db_session, trek)
        add_bike_and_commit(db_session, diamondback)
        assert True  # pass this test
    except sqlalchemy.exc.SQLAlchemyError as error:
        print(f'Problem adding bikes to db: {error}')
        assert error is None  # fail this test
    finally:
        db_session.close()


def test_select(db_session_maker, schwinn, trek, diamondback):
    """
    Validates that we can find what we inserted

    :return: there is no return from this method.
    """

    db_session = db_session_maker()
    query = db_session.query(BikesTable).order_by(BikesTable.id)
    results = query.all()

    assert len(results) == 3
    assert results[0].id == 1 and results[1].id == 2 and results[2].id == 3
    assert results[0].name == schwinn.get_name()
    assert results[1].name == trek.get_name()
    assert results[2].name == diamondback.get_name()
    assert not results[0].bmx
    assert not results[1].bmx
    assert results[2].bmx


def test_update(db_session_maker, schwinn):
    """
    Validates that we can insert into the bikes table.

    :return: there is no return from this method.
    """

    db_session = db_session_maker()
    query = db_session.query(BikesTable).filter_by(name=schwinn.get_name())
    results = query.all()

    assert len(results) == 1
    assert results[0].id == 1
    assert results[0].name == schwinn.get_name()
    assert not results[0].bmx

    results[0].bmx = True
    db_session.commit()

    results = query.all()
    assert len(results) == 1
    assert results[0].id == 1
    assert results[0].name == schwinn.get_name()
    assert results[0].bmx


def test_dslete(db_session_maker, schwinn):
    """
    Validates that we can delete a bike

    :return: there is no return from this method.
    """

    db_session = db_session_maker()
    query = db_session.query(BikesTable).filter_by(name=schwinn.get_name(), bmx=True)
    results = query.all()

    assert len(results) == 1
    assert results[0].id == 1
    assert results[0].name == schwinn.get_name()
    assert results[0].bmx

    db_session.delete(results[0])

    results = query.all()
    assert len(results) == 0
