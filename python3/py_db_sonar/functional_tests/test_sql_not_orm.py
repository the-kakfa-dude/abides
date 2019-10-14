"""
This file tests the ORM aspect of our example sqlalchemy, namely the bikes table.
"""
import sqlalchemy

from py_db_sonar.car import Car


def to_list_of_dict(result_proxy) -> list:

    # this assumes you actually like the interface you get
    # when a RowProxy object turns a row into a dictionary.
    return [dict(row) for row in result_proxy]


def test_insert(db_connection,
                cars_table,
                bat_mobile,
                crashed_bat_mobile,
                crashed_hangover_benz):
    """
    Validates that we can insert into the cars table.

    :return: there is no return from this method.
    """
    # put the test data in it
    query = sqlalchemy.insert(cars_table)
    cars = [{'make': bat_mobile.get_make(),
             'model': bat_mobile.get_model(),
             'junker': False},
            {'make': crashed_bat_mobile.get_make(),
             'model': crashed_bat_mobile.get_model(),
             'junker': True},
            {'make': crashed_hangover_benz.get_make(),
             'model': crashed_hangover_benz.get_model(),
             'junker': True}]
    result_proxy = db_connection.execute(query, cars)

    assert result_proxy is not None
    assert result_proxy.is_insert
    assert not result_proxy.returns_rows
    assert result_proxy.rowcount == 3


def test_select_one(db_connection, cars_table, bat_mobile):
    """
    Validates that that the test data was placed in the database
    via the various test fixtures.

    :return: there is no return from this method.
    """
    expected = Car('bat', 'mobile', junker=False)

    query = sqlalchemy.select([cars_table]).where(
        sqlalchemy.and_(cars_table.c.make == expected.get_make(),
                        cars_table.c.model == expected.get_model(),
                        cars_table.c.junker == expected.is_junker()))

    result_proxy = db_connection.execute(query)
    results = to_list_of_dict(result_proxy)

    assert len(results) == 1
    assert results[0]['make'] == bat_mobile.get_make()
    assert results[0]['model'] == bat_mobile.get_model()
    assert not results[0]['junker']


def test_select_many(db_connection, cars_table):
    """
    Validates that that the test data was placed in the database
    via the various test fixtures.

    :return: there is no return from this method.
    """

    query = sqlalchemy.select([cars_table]).where(cars_table.c.make == 'bat')
    result_proxy = db_connection.execute(query)

    results = to_list_of_dict(result_proxy)

    assert len(results) == 2
    assert results[0]['make'] == 'bat'
    assert results[1]['make'] == 'bat'
    assert (results[0]['model'] == 'mobile' and results[1]['model'] == 'murcielago') \
        or (results[1]['model'] == 'mobile' and results[0]['model'] == 'murcielago')
    assert (results[0]['junker'] and not results[1]['junker']) \
        or (results[1]['junker'] and not results[0]['junker'])


def test_update(db_connection, cars_table):
    """
    Validates that that the test data was placed in the database
    via the various test fixtures.

    :return: there is no return from this method.
    """
    cars_table.update(cars_table.c.model == 'mobile').execute(junker=True)

    select_query = sqlalchemy.select([cars_table]).where(cars_table.c.junker)
    result_proxy = db_connection.execute(select_query)

    assert result_proxy is not None
    assert not result_proxy.is_insert
    assert result_proxy.returns_rows
    assert result_proxy.rowcount == 3

    results = to_list_of_dict(result_proxy)
    assert results[0]['junker']
    assert results[1]['junker']
    assert results[2]['junker']


def test_delete(db_connection, cars_table, crashed_hangover_benz):
    """
    Validates that that the test data was placed in the database
    via the various test fixtures.

    :return: there is no return from this method.
    """
    delete_query = cars_table.delete().where(cars_table.c.make == 'bat')
    delete_results_proxy = db_connection.execute(delete_query)

    assert delete_results_proxy is not None
    assert not delete_results_proxy.is_insert
    assert not delete_results_proxy.returns_rows
    assert delete_results_proxy.rowcount == 2

    select_query = sqlalchemy.select([cars_table])
    result_proxy = db_connection.execute(select_query)

    results = to_list_of_dict(result_proxy)

    assert len(results) == 1
    assert results[0]['make'] == crashed_hangover_benz.get_make()
    assert results[0]['model'] == crashed_hangover_benz.get_model()
