import argparse

from io import StringIO
from unittest import mock, TestCase

from py_sonar.main import main


@mock.patch('sys.stdout', new_callable=StringIO)
@mock.patch('argparse.ArgumentParser.parse_args',
            return_value=argparse.Namespace(make='foo', model='bar'))
class TestMainClass(TestCase):
    """
    If you want to patch more than one thing in a test,
    like standard out and the standard args parser,
    making a like this class is the best way to do it.
    """

    def test_main(self, _, mock_stdout):

        main()

        self.assertEqual(mock_stdout.getvalue(),
                         'vroom vroom goes the foo bar\n',  # don't forget the trailing newline
                         'we did not get a vroom vroom for make foo and model bar')
