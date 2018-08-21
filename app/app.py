"""
Flask app bootstrapping with api injection
"""

from flask import Flask
from os import environ

from app.config import config_by_name
from app.routes import API

APP = Flask(__name__)

APP.config.from_object(config_by_name[environ.get("FLASK_ENV")])

API.init_app(APP)

if __name__ == "__main__":
    APP.run(debug=True)
