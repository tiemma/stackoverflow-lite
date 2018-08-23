"""
Implmentation for logging services

"""

from logging import handlers, Formatter, StreamHandler, getLogger, DEBUG
import sys

FORMATTER = Formatter("%(asctime)s — %(name)s — %(levelname)s — %(message)s")
LOG_FILE = "/home/blank/PycharmProjects/stackoveflow-lite-api/app/logging/App.log"


class Logger:
    """
    Logging class for implementing logging functions
    """
    @staticmethod
    def get_console_handler():
        """

        :return:
        """
        console_handler = StreamHandler(sys.stdout)
        console_handler.setFormatter(FORMATTER)
        return console_handler

    @staticmethod
    def get_file_handler():
        """

        :return:
        """
        file_handler = handlers.TimedRotatingFileHandler(LOG_FILE, when='midnight')
        file_handler.setFormatter(FORMATTER)
        return file_handler

    @staticmethod
    def get_logger(logger_name):
        """

        :param logger_name:
        :return:
        """
        logger = getLogger(logger_name)
        logger.setLevel(DEBUG) # better to have too much log than not enough
        logger.addHandler(Logger.get_console_handler())
        logger.addHandler(Logger.get_file_handler())
        # with this pattern, it's rarely necessary to propagate the error up to parent
        logger.propagate = False
        return logger
