"""
This module tests the bootstrapping function which excecutes
the table.sql file and creates the tables
"""

from os import environ

from app.app import CONFIG_BY_NAME
from app.models.model import Model


class Test(Model):
    """
    Test class implementing Model class
    """
    TABLE_NAME = "users"


TEST_MODEL = Test()

USER_PAYLOAD = {"name": "Bakadre Emmauek",
                "username": "Tiemmas",
                "password": "password"
                }


def test_not_implemented_error():
    """
    This should throw the NotImplementedError since the Model class ideally
    shouldn't be instantiated directly
    :return:
    """
    try:
        Model()
    except Exception as err:
        assert isinstance(err, NotImplementedError)


def test_bootstrap_tables():
    """
    Creates the tables and It should only run in development

    :return:
    """
    try:
        if CONFIG_BY_NAME[environ.get("FLASK_ENV")].DEBUG:
            assert TEST_MODEL.bootstrap_tables()
        else:
            assert not TEST_MODEL.bootstrap_tables()
    except Exception as err:
        assert isinstance(err, NotImplementedError)


def test_insert_user():
    """
    This tests insert operations

    :return:
    """
    user_id = TEST_MODEL.insert(USER_PAYLOAD)
    assert isinstance(user_id, list)
    assert user_id[0]['id'] == 1
    assert len(user_id) == 1


def test_parse_to_sql_format():
    """

    :return:
    """
    assert ["name='value'"] == Model.parse_to_sql_format({"name": "value"}, "=")


def test_select_all():
    """

    :return: 
    """
    response = TEST_MODEL.select_all(["*"])[0]
    assert sorted([response[k] == USER_PAYLOAD[k]
                   for k in response
                   if k in USER_PAYLOAD])[0]


def test_select_all_with_constraints():
    """

    :return:
    """
    response = TEST_MODEL.select_all_with_constraints(USER_PAYLOAD.keys(), {"id": 1})[0]
    assert sorted([response[k] == USER_PAYLOAD[k]
                   for k in response
                   if k in USER_PAYLOAD])[0]


def test_update_user():
    """

    :return:
    """
    NEW_USER_PAYLOAD = dict(USER_PAYLOAD)
    NEW_USER_PAYLOAD["name"] = "New Name"
    response = TEST_MODEL.update(NEW_USER_PAYLOAD, USER_PAYLOAD)
    print(response)
    assert (response[0]["id"] == 1)


def test_execute_raw_sql():
    """

    :return:
    """
    NEW_USER_PAYLOAD = dict(USER_PAYLOAD)
    NEW_USER_PAYLOAD["name"] = "New Name"
    response = TEST_MODEL.execute_raw_sql("SELECT * FROM USERS")[0]
    assert sorted([response[k] == NEW_USER_PAYLOAD[k]
                   for k in response
                   if k in NEW_USER_PAYLOAD])[0]


def test_delete_user():
    """
    This deletes a user from the database

    :return:
    """
    user_id = TEST_MODEL.delete(USER_PAYLOAD)
    assert isinstance(user_id, list)
    assert not user_id
