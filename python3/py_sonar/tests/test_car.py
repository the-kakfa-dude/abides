from py_sonar.car import Car


def test_klunker(klunker):
    """
    Validates constructing a Car via the klunker test fixture.

    :param klunker: the test fixture
    :return: there is no return from this function.
    """

    actual = Car(klunker.get_make(), klunker.get_model())

    assert actual.get_make() == klunker.get_make()
    assert actual.get_model() == klunker.get_model()


def test_nones():
    """
    Validates you can construct a car without specifying
    real values for make and model.

    We don't use the tesla here, because that make and model is the default.

    :param klunker: the test fixture
    :return: there is no return from this function.
    """

    actual = Car(None, None)

    assert actual.get_make() is None
    assert actual.get_model() is None


def test_setters():
    """
    Validates you can construct can update the make and model

    :param klunker: the test fixture
    :return: there is no return from this function.
    """

    actual = Car('ford', 'truck')

    assert actual.get_make() == 'ford'
    assert actual.get_model() == 'truck'

    actual.set_make('not_ford')
    assert actual.get_make() == 'not_ford'

    actual.set_model('not_truck')
    assert actual.get_model() == 'not_truck'
