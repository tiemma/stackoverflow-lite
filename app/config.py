"""
Project level flask configuration

"""

from os import urandom

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "stackoverflow"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = 5432




class Config:
    """
    Config base class
    """
    DEBUG = True
    SECRET_KEY = urandom(256)
    POSTGRES_CONFIG = {
        'user': POSTGRES_USER,
        'password': POSTGRES_PASSWORD,
        'dbname': POSTGRES_DB,
        'host': POSTGRES_HOST,
        'port': POSTGRES_PORT,
    }
    DATABASE_URI = """postgresql://
    %(user)s:%(password)s@
    %(host)s:%(port)s/%(dbname)s""" % POSTGRES_CONFIG
    CSRF_ENABLED = True
    CSRF_SESSION_KEY = urandom(256)
    RESTPLUS_VALIDATE = True


class Development(Config):
    """
    Development configuration
    """
    THREADS_PER_PAGE = 1


class Production(Config):
    """
    Production configuration
    """
    DEBUG = False
    THREADS_PER_PAGE = 8


config_by_name = dict(
    development=Development,
    production=Production
)

if __name__ == "__main__":
    print(Config)
