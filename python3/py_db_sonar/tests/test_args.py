from py_db_sonar.car import Car
from py_db_sonar.main import args_to_car


def test_from_args():
    """
    Validates that if you start with a car-like object,
    (meaning something that has a dot-make and a dot-model),
    you get back a car with the same make and model.

    :return: there is no return from this method.
    """

    expected = Car('something', 'random')
    actual = args_to_car(expected)

    assert isinstance(actual, Car)
    assert actual.get_make() == expected.get_make()
    assert actual.get_model() == expected.get_model()


def test_default_from_args(tesla):
    """
    Validates that if the make and model args are None, that we get back
    the default car, which has the same make and model as the tesla test fixture.

    :param tesla: the tesla text fixture.
    :return: there is no return from this method.
    """

    empty_car = Car(None, None)
    actual = args_to_car(empty_car)

    assert isinstance(actual, Car)
    assert actual.get_make() == tesla.get_make()
    assert actual.get_model() == tesla.get_model()
