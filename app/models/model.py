"""
Model base model defining methods inherited by all other model classes

Defines CRUD operations along with neatly integrated static factory functions
"""

from app.logging import Logger
from os import environ
from psycopg2 import connect, extras, ProgrammingError

from app.config import config_by_name


class Model:
    """
    Model base class for ORM like emulation, since we couldn't use one :-(
    """

    TABLE_NAME = ""
    logger = Logger.get_logger(__name__)

    def __init__(self):
        self.logger.info("Constructor was called")
        self.conn = Model.init_conn()
        self.cursor = self.conn.cursor(cursor_factory=extras.RealDictCursor)

        if not self.TABLE_NAME:
            raise NotImplementedError("Property TABLE_NAME must be defined in the inheriting class")

    def __del__(self):
        self.logger.info("Destructor has closed all connections")
        self.conn.close()
        self.cursor.close()

    @staticmethod
    def init_conn():
        """

        :return:
        """
        # POSTGRES_CONFIG["async"] = True
        POSTGRES_CONFIG = config_by_name[environ.get("FLASK_ENV")].POSTGRES_CONFIG
        return connect(**POSTGRES_CONFIG)

    @staticmethod
    def parse_to_sql_format(constraints: dict, delimiter: str) -> list:
        """

        :param constraints:
        :param delimiter:
        :return:
        """
        expression = "{name}{delimiter}{value}" if delimiter == "." \
            else "{name}{delimiter}'{value}'"
        parsed_constraints = [expression.format(name=x,
                                                delimiter=delimiter,
                                                value=constraints[x]) for x in constraints]
        return parsed_constraints

    def bootstrap_tables(self):
        """
        Drops and recreates tables
        Only valid for use if in development
        Not accessible to run once in production configuration

        :return:
        """
        with open("sql/tables.sql", 'r') as file:
            self.cursor.execute("".join(file.readlines()))

        if not config_by_name[environ.get("FLASK_ENV")].DEBUG:
            self.logger.debug("Tables cannot be dropped in production")
            return False

        self.conn.commit()
        return True

    def select_all(self, fields: list):
        """

        :return:
        """
        sql = "SELECT {fields} " \
              "FROM {table}".format(table=self.TABLE_NAME,
                                    fields=",".join(fields))
        self.logger.debug(sql)
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def select_one(self, fields: list, constraints: dict):
        """

        :param fields:
        :param constraints:
        :return:
        """
        if not constraints:
            return self.select_all(fields)

        sql = "SELECT {fields}" \
              " FROM {table} " \
              "WHERE {constraints}".format(fields=",".join(fields),
                                           table=self.TABLE_NAME,
                                           constraints=" AND ".join(
                                               Model.parse_to_sql_format(constraints, "=")))
        self.logger.debug(sql)
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def delete(self, constraints: dict):
        """

        :param constraints:
        :return:
        """
        sql = "DELETE FROM {table} " \
              "WHERE {constraints}".format(table=self.TABLE_NAME,
                                           constraints=" AND ".join(
                                               Model.parse_to_sql_format(constraints, "=")))
        print(sql)
        self.cursor.execute(sql)
        self.conn.commit()
        return self.cursor.fetchall()

    def insert(self, constraints: dict):
        """

        :param constraints:
        :return:
        """
        keys = ",".join(constraints.keys())
        values = ",".join(["'{x}'".format(x=x) for x in constraints.values()])
        sql = "INSERT INTO {table} ({keys})" \
              " VALUES ({values})".format(table=self.TABLE_NAME,
                                          keys=keys,
                                          values=values)
        self.logger.debug(sql)
        self.cursor.execute(sql)
        self.conn.commit()
        return True

    def update(self, update_fields: dict, constraints: dict):
        """

        :param update_fields:
        :param constraints:
        :return:
        """
        sql = "UPDATE {table} " \
              "SET {update_fields} " \
              "WHERE {constraints}".format(table=self.TABLE_NAME,
                                           update_fields=",".join(
                                               Model.parse_to_sql_format(update_fields, "=")),
                                           constraints=" AND ".join(
                                               Model.parse_to_sql_format(constraints, "=")))
        self.logger.debug(sql)
        self.cursor.execute(sql)
        self.conn.commit()
        return True

    def execute_raw_sql(self, sql: str):
        """

        :param sql:
        :return:
        """
        self.logger.debug(sql)
        self.cursor.execute(sql)
        self.conn.commit()
        try:
            return self.cursor.fetchall()
        except ProgrammingError:
            self.logger.error("Execution error while running SQL: \n sql", exc_info=True)
            return True


if __name__ == "__main__":
    pass
    # print(Model().bootstrap_tables())
    # print(
    #     Model().insert(
    #         "users", {
    #             "username": "Bakare", "name": "Bakare Emmanuel", "password": "34s4"}))
    # print(
    #     Model().update(
    #         "users", {
    #             "username": "Bakare", "name": "Bakare Emmanuel", "password": "34s4"}, {
    #             "id": 3, "password": "34s"}))
