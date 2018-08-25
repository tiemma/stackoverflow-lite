"""
Flask app bootstrapping with api injection
"""

from flask import Flask
from os import environ

from app.config import CONFIG_BY_NAME
from app.routes import create_api

APP = Flask(__name__)


def create_app():
    """

    :return:
    """

    APP.config.from_object(CONFIG_BY_NAME[environ.get("FLASK_ENV")])

    create_api().init_app(APP)

    return APP


@APP.before_first_request
def init_db():
    pass


if __name__ == "__main__":
    create_app().run(debug=True)



