"""
Controller init defining minor functions
"""

from psycopg2 import IntegrityError, InternalError

from app.logging import Logger

LOGGER = Logger.get_logger(__name__)


def handle_error_message(error: Exception):
    """

    :param error:
    :return:
    """
    try:
        raise error
    except IntegrityError as err:
        LOGGER.error(err)
        return {"message": "Internal server error occurred"}, 500
    except InternalError as err:
        LOGGER.error(err)
        return {"message": "Transaction has been blacklisted, try again later"}, 508
    except Exception as err:
        LOGGER.error(err)
    return {"message": "Unknown error occurred"}, 500
