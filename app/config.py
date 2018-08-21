from os import urandom

"""
Project level flask configuration

"""

POSTGRES_USER = "postgres"
POSTGRES_PASSWORD = "password"
POSTGRES_DB = "stackoverflow"
POSTGRES_HOST = "localhost"
POSTGRES_PORT = 5432

POSTGRES_CONFIG = {
    'user': POSTGRES_USER,
    'password': POSTGRES_PASSWORD,
    'dbname': POSTGRES_DB,
    'host': POSTGRES_HOST,
    'port': POSTGRES_PORT,
}


class Config(object):

    DEBUG = True
    SECRET_KEY = urandom(256)
    DATABASE_URI = 'postgresql://%(user)s:%(password)s@%(host)s:%(port)s/%(dbname)s' % POSTGRES_CONFIG


class Development(Config):
    pass


class Production(Config):
    pass


if __name__ == "__main__":
    print(Config)




