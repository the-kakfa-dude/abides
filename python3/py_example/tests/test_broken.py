import pytest


@pytest.mark.xfail(Strict="false")
def test_busted(tesla):
    assert tesla.get_model == "wrong"
