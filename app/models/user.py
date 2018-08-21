"""
User Model for querying the users table
"""

from app.models.model import Model


class User(Model):
    """
    User class defining the users table
    """

    TABLE_NAME = "users"
