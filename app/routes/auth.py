"""
AUTH_NS definitions for authentication [Login / Signup]
"""

from flask import request
from flask_restplus import Resource, fields, Namespace
from flask_restplus._http import HTTPStatus
from psycopg2 import IntegrityError

from app.logging import Logger
from app.models import USER_MODEL

AUTH_NS = Namespace("auth", description="Authentication related operations")

LOGIN = AUTH_NS.model('Auth', {
    'username': fields.String(required=True, description='The users pet name'),
    'password': fields.String(description='User password sent on signup and login')
})

REGISTER = AUTH_NS.model('User', {
    'name': fields.String(required=True, description='The users name'),
    'username': fields.String(required=True, description='The users pet name'),
    'password': fields.String(description='User password sent on signup and login')
})


@AUTH_NS.route("/login")
@AUTH_NS.response(HTTPStatus.NOT_FOUND, "User not found and authentication request rejected")
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
@AUTH_NS.response(HTTPStatus.NOT_FOUND, "User not found and logout request rejected")
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
@AUTH_NS.response(HTTPStatus.NOT_FOUND, "Server down while processing registration")
@AUTH_NS.response(HTTPStatus.CONFLICT, "User details are already existent")
@AUTH_NS.response(HTTPStatus.CREATED, "User details have been successfully registered in the database")
class Register(Resource):
    """
    Login controller resource
    """
    logger = Logger.get_logger(__name__)

    def get(self):
        """

        :return:
        """
        return {}, HTTPStatus.OK

    @AUTH_NS.expect(REGISTER, validate=True)
    def post(self):
        """

        :return:
        """
        payload = request.json
        self.logger.debug("Payload variables: {}".format(payload))
        try:
            return {"message": "User was registered successfully", "data": USER_MODEL.insert(payload)}, 201
        except IntegrityError:
            return {"message": "User is already registered"}, 409

