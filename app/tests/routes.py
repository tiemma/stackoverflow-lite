"""
Tests for the routes library
"""

from flask import json
from flask_restplus._http import HTTPStatus
from pytest import fixture

from app import create_app
from app.tests.models import test_bootstrap_tables, test_insert_user

PREFIX = "/api/v1"
HEADERS = {"Content-Type": "application/json", "accept": "application/json"}

QUESTION_PAYLOAD = {"user_id": 1,
                    "headline": "This is a question",
                    "description": "I added a description"}

ANSWER_PAYLOAD = {
    "headline": "string",
    "question_id": 1,
    "user_id": 1,
    "description": "string"
}

@fixture(scope='module')
def test_client():

    test_bootstrap_tables()
    flask_app = create_app()

    # Flask provides a way to test your application by exposing the Werkzeug test Client
    # and handling the context locals for you.
    testing_client = flask_app.test_client()

    # Establish an application context before running the tests.
    ctx = flask_app.app_context()
    ctx.push()

    yield testing_client  # this is where the testing happens!

    ctx.pop()


@fixture(scope='module')
def init_user_db():
    test_insert_user()


def test_swagger_endpoint(test_client):
    response = test_client.get("/")
    assert response.status_code == HTTPStatus.OK
    assert b"swagger" in response.data
    assert b"Stack Overflow Lite" in response.data


def test_post_question(test_client, init_user_db):
    response = test_client.post(PREFIX+'/questions/',
                                data=json.dumps(QUESTION_PAYLOAD),
                                headers=HEADERS)
    assert response.status_code == HTTPStatus.CREATED
    assert json.loads(response.data)["data"]["id"] == 1


def test_get_non_existent_user(test_client):
    response = test_client.get(PREFIX+'/users/6',
                               headers=HEADERS)
    data = json.loads(response.data)
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert "Details not found" in data["message"]


def test_get_questions(test_client):
    response = test_client.get(PREFIX+'/questions/',
                               headers=HEADERS)
    data = json.loads(json.loads(response.data)['data'])[0]
    assert response.status_code == HTTPStatus.OK
    assert set(data).issuperset(QUESTION_PAYLOAD)
    assert data["id"] == 1
    assert data["user_id"] == 1


def test_get_non_existent_answer(test_client):
    response = test_client.get(PREFIX+'/questions/1/answers',
                               headers=HEADERS)
    data = json.loads(response.data)
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert "Details not found" in data["message"]


def test_post_answer(test_client):
    response = test_client.post(PREFIX+'/questions/1/answers',
                                data=json.dumps(ANSWER_PAYLOAD),
                                headers=HEADERS)
    data = json.loads(response.data)
    assert response.status_code == HTTPStatus.CREATED
    assert data["data"]["id"] == 1


def test_accept_answer(test_client):
    response = test_client.put(PREFIX+'/questions/1/answers/1',
                               data=json.dumps(ANSWER_PAYLOAD),
                               headers=HEADERS)
    data = json.loads(response.data)
    assert response.status_code == HTTPStatus.OK
    assert data["data"][0]["id"] == 1


def test_accept_answer_in_non_existent_question(test_client):
    response = test_client.put(PREFIX+'/questions/6/answers/1',
                               data=json.dumps(ANSWER_PAYLOAD),
                               headers=HEADERS)
    data = json.loads(response.data)
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert "Details not found" in data["message"]
