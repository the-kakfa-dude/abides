import pytest


@pytest.mark.xfail(Strict="false")
def test_busted(tesla):
    """
    This is just to illustrate how you mark a test as flaky,
    and tell pytest that that's okay.

    :param tesla: the tesla test fixture.

    :return: this function does not return a value.
    """
    assert tesla.get_model() == "wrong"
