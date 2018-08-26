"""
Implementation for logger services

"""

from logging import handlers, Formatter, StreamHandler, getLogger, DEBUG

from os import getcwd
import sys

FORMATTER = Formatter("%(asctime)s — %(name)s — %(levelname)s — %(message)s")
LOG_FILE = "{current_working_dir}/src/logger/App.log".format(current_working_dir=getcwd())


class Logger:
    """
    Logging class for implementing logger functions
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
