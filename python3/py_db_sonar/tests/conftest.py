import pytest
from py_db_sonar.car import Car


@pytest.fixture
def tesla() -> Car:
    return Car('tesla', 'expensive')


@pytest.fixture
def klunker() -> Car:
    return Car('klunker', 'cheap', junker=True)
