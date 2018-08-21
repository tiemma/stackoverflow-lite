"""
API definitions for the USER
"""

from flask import json
from flask_restplus import Namespace, Resource, fields

from app.models import USER_MODEL

API = Namespace("users", "User related operations")

USER = API.model('User', {
    'name': fields.String(required=True, description='The users name'),
    'username': fields.String(required=True, description='The users pet name'),
    'created': fields.DateTime(required=True, description='The date the USER was created'),
    'password': fields.String(description='User password sent on signup and login')
})


@API.route("/<int:id>")
@API.param('id', 'User id for easy identification')
@API.response(404, 'User not found')
class User(Resource):
    """
    User resource class for defining USER related API actions
    """

    @API.expect(USER)
    def get(self, id: int):
        """

        :param id:
        :return:
        """
        response = USER_MODEL.select_one(
            ["name, username, created"], {"id": id})
        return json.dumps(response), 200


