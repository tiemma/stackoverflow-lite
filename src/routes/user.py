"""
API definitions for the USER
"""

from flask import json
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required, get_jwt_identity, get_raw_jwt)
from flask_restplus import Namespace, Resource, fields
from flask_restplus._http import HTTPStatus

from src.controller import handle_error_message, NoResponseError
from src.logger import Logger
from src.models import USER_MODEL

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
        try:
            response = USER_MODEL.select_one(
                ["name, username, created"], {"id": id})
            self.logger.debug(response)

            if not response:
                return handle_error_message(NoResponseError)
        except IndexError as err:
            return handle_error_message(err)

        return {"message": "User was successfully retrieved",
                "data": json.dumps(response)}, HTTPStatus.OK

