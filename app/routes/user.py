"""
API definitions for the USER
"""

from flask import json
from flask_restplus import Namespace, Resource, fields
from flask_restplus._http import HTTPStatus
from sys import exc_info

from app.logging import Logger
from app.models import USER_MODEL

USER_NS = Namespace("users", "User related operations")

USER = USER_NS.model('User', {
    'name': fields.String(required=True, description='The users name'),
    'username': fields.String(required=True, description='The users pet name'),
    'created': fields.DateTime(required=True, description='The date the USER was created'),
    'password': fields.String(description='User password sent on signup and login')
})


@USER_NS.route("/<int:id>")
@USER_NS.param('id', 'User id for easy identification')
@USER_NS.response(HTTPStatus.NOT_FOUND, 'User not found')
class User(Resource):
    """
    User resource class for defining USER related API actions
    """
    logger = Logger.get_logger(__name__)

    # @API.marshal_list_with(USER, code=HTTPStatus.OK, skip_none=True)
    def get(self, id: int):
        """

        :param id:
        :return:
        """
        response = USER_MODEL.select_one(
            ["name, username, created"], {"id": id})
        self.logger.debug(response)
        try:
            return json.dumps(response[0]), HTTPStatus.OK
        except IndexError as e:
            return "{}".format(e), 404
