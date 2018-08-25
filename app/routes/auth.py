"""
AUTH_NS definitions for authentication [Login / Signup]
"""

from flask import request
from flask_jwt_extended import jwt_required
from flask_restplus import Resource, fields, Namespace
from flask_restplus._http import HTTPStatus
from psycopg2 import IntegrityError

from app.controller import handle_error_message
from app.logging import Logger
from app.models import USER_MODEL

AUTH_NS = Namespace("auth", description="Authentication related operations")

LOGIN = AUTH_NS.model('Auth', {
    'username': fields.String(required=True, description='The users pet name'),
    'password': fields.String(required=True, description='User password sent on signup and login')
})

REGISTER = AUTH_NS.model('User', {
    'name': fields.String(required=True, description='The users name'),
    'username': fields.String(required=True, description='The users pet name'),
    'password': fields.String(required=True, description='User password sent on signup and login')
})


@AUTH_NS.route("/login")
@AUTH_NS.response(HTTPStatus.NOT_FOUND,
                  "User not found and authentication request rejected")
class Login(Resource):
    """
    Login controller resource
    """
    logger = Logger.get_logger(__name__)

    @AUTH_NS.expect(LOGIN)
    def post(self):
        """

        :return:
        """
        payload = request.json
        self.logger.debug(payload)
        return {}, HTTPStatus.OK


@AUTH_NS.route("/logout")
@AUTH_NS.response(HTTPStatus.NOT_FOUND,
                  "User not found and logout request rejected")
class Logout(Resource):
    """
    Login controller resource
    """
    logger = Logger.get_logger(__name__)

    @AUTH_NS.expect(LOGIN)
    def post(self):
        """

        :return:
        """
        payload = AUTH_NS.payload
        self.logger.debug(payload)


@AUTH_NS.route("/register")
@AUTH_NS.response(HTTPStatus.NOT_FOUND,
                  "Server down while processing registration")
@AUTH_NS.response(HTTPStatus.CONFLICT,
                  "User details are already existent")
@AUTH_NS.response(HTTPStatus.CREATED,
                  "User details have been successfully registered in the database")
class Register(Resource):
    """
    Login controller resource
    """
    logger = Logger.get_logger(__name__)

    @AUTH_NS.expect(REGISTER, validate=True)
    @jwt_required
    def post(self):
        """

        :return:
        """
        payload = request.json
        self.logger.debug("Payload variables: %s", payload)
        try:
            data = USER_MODEL.insert(payload)

            return {"message": "User was registered successfully",
                    "data": data,
                    **USER_MODEL.create_jwt_tokens(data)
                    }, 201
        except IntegrityError:
            return {"message": "User is already registered"}, 409
        except Exception as err:
            return handle_error_message(err)
