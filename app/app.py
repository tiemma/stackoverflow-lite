"""
Flask app bootstrapping with api injection
"""

from os import environ
from flask import Flask

from app.config import CONFIG_BY_NAME
from app.routes import API

APP = Flask(__name__)
APP.config.from_object(CONFIG_BY_NAME[environ.get("FLASK_ENV")])

API.init_app(APP)

if __name__ == "__main__":
    APP.run(debug=True)
