"""
User Model for querying the users table
"""

from flask_jwt_extended import JWTManager, create_refresh_token, create_access_token
from passlib.hash import pbkdf2_sha256 as sha256

from src.models.model import Model


class User(Model):
    """
    User class defining the users table
    """

    TABLE_NAME = "users"

    @staticmethod
    def generate_hash(password: str):
        """

        :param password:
        :return:
        """
        return sha256.hash(password)

    @staticmethod
    def verify_hash(password: str, hash: str):
        """

        :param password:
        :param hash:
        :return:
        """
        return sha256.verify(password, hash)

    @staticmethod
    def create_jwt_tokens(data: dict):
        username = data["username"]
        return {"access_token": create_access_token(username), "refresh_token": create_refresh_token(username)}
