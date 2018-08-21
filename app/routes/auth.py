"""
API definitions for authentication [Login / Signup]
"""

from flask_restplus import Namespace, Resource, fields

from app.routes.user import USER

API = Namespace("users", "User related operations")

LOGIN = API.model('Login', {
    'username': fields.String(required=True, description='The users pet name'),
    'password': fields.String(description='User password sent on signup and login')
})


@API.response(404, "User not found and authentication request rejected")
class Login(Resource):
    """
    Login controller resource
    """

    @API.expect(LOGIN)
    def post(self):
        """

        :return:
        """
        payload = API.payload
        print(payload)


@API.response(404, "User not found and logout request rejected")
class Logout(Resource):
    """
    Login controller resource
    """

    @API.expect(LOGIN)
    def post(self):
        """

        :return:
        """
        payload = API.payload
        print(payload)


@API.response(500, "Internal server error while processing registration")
class Register(Resource):
    """
    Login controller resource
    """

    @API.expect(USER)
    def post(self):
        """

        :return:
        """
        payload = API.payload
        print(payload)