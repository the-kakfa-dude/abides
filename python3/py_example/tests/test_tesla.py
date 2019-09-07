from py_example.car import Car


def test_tesla(tesla):

    expected_results = Car("tesla", "expensive")

    assert tesla.get_make() == expected_results.get_make()
    assert tesla.get_model() == expected_results.get_model()
