"""
Tests for the routes library
"""


from pytest import fixture

from app import create_app
from app.tests.models import test_bootstrap_tables


@fixture(scope='module')
def test_client(test_bootstrap_table):

    flask_app = create_app()

    # Flask provides a way to test your application by exposing the Werkzeug test Client
    # and handling the context locals for you.
    testing_client = flask_app.test_client()

    # Establish an application context before running the tests.
    ctx = flask_app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()


def test_swagger_endpoint(test_client):
    pass

