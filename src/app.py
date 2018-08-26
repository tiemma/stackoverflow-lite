"""
Flask src bootstrapping with api injection
"""


from flask import Flask
from flask_jwt_extended import JWTManager
from os import environ

from src.config import CONFIG_BY_NAME
from src.routes import api

app = Flask(__name__)


def create_app():
    """

    :return:
    """

    print("App initialized")

    app.config.from_object(CONFIG_BY_NAME[environ.get("FLASK_ENV")])

    api.init_app(app)

    JWTManager().init_app(app)

    return app


@app.before_first_request
def init_db():
    """

    :return:
    """
    pass


create_app()


if __name__ == "__main__":
    create_app().run(debug=True)

