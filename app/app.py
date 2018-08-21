from flask import Flask

from app import config

app = Flask(__name__)

app.config.from_object(config.Development)

