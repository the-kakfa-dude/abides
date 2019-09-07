from py_example.car import Car

import pytest


@pytest.fixture
def tesla() -> Car:
    """
    A sample fixture that just returns the default car
    """

    return Car("tesla", "expensive")
