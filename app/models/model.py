from app.config import POSTGRES_CONFIG, Config
from psycopg2 import connect, extras, ProgrammingError


class Model:
    def __init__(self):
        print("Constructor was called")
        self.conn = Model.init_conn()
        self.cursor = self.conn.cursor(cursor_factory=extras.RealDictCursor)

    def __del__(self):
        print("Destructor has closed all connections")
        self.conn.close()
        self.cursor.close()

    @staticmethod
    def init_conn():
        """

        :return:
        """
        return connect(**POSTGRES_CONFIG)

    @staticmethod
    def parse_constraints_dict_to_sql_format(constraints: dict, delimiter: str) -> list:
        """

        :param constraints: 
        :param delimiter: 
        :return: 
        """
        expression = "{name}{delimiter}{value}" if delimiter == "." else "{name}{delimiter}'{value}'";
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
        with open("sql/tables.sql", 'r') as o:
            self.cursor.execute("".join(o.readlines()))

        if not Config.DEBUG:
            print("Tables cannot be dropped in production")
            return False

        self.conn.commit()

    def select_all(self, table: str, fields: list):
        """

        :param table:
        :return:
        """
        sql = "SELECT {fields} FROM {table}".format(table=table, fields=",".join(fields))
        print(sql)
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def select_with_constraints(self, table: str, fields: list, constraints: dict):
        """

        :param self:
        :param table:
        :param constraints:
        :return:
        """
        if not constraints:
            return self.select_all(table)

        sql = "SELECT {fields} FROM {table} WHERE {constraints}".format(fields=",".join(fields),
                                                                        table=table,
                                                                        constraints=" AND ".join(
                                                                            Model.parse_constraints_dict_to_sql_format(constraints, "=")))
        print(sql)
        self.cursor.execute(sql)
        return self.cursor.fetchall()

    def delete_with_constraints(self, table: str, constraints: dict):
        """

        :param table:
        :param constraints:
        :return:
        """
        sql = "DELETE FROM {table} WHERE {constraints}".format(table=table,
                                                               constraints=" AND ".join(
                                                                   Model.parse_constraints_dict_to_sql_format(constraints, "=")))
        print(sql)
        self.cursor.execute(sql)
        self.conn.commit()
        return self.cursor.fetchall()

    def insert_with_constraints(self, table: str, constraints: dict):
        """

        :param table:
        :param constraints:
        :return:
        """
        keys = ",".join(constraints.keys())
        values = ",".join(["'{x}'".format(x=x) for x in constraints.values()])
        sql = "INSERT INTO {table} ({keys}) VALUES ({values})".format(table=table,
                                                                      keys=keys,
                                                                      values=values)
        print(sql)
        self.cursor.execute(sql)
        self.conn.commit()
        return True

    def update_with_constraints(self, table: str, update_fields: dict, constraints: dict):
        sql = "UPDATE {table} SET {update_fields} WHERE {constraints}".format(table=table,
                                                                              update_fields=",".join(Model.parse_constraints_dict_to_sql_format(update_fields, "=")),
                                                                              constraints=" AND ".join(
                                                                                  Model.parse_constraints_dict_to_sql_format(constraints, "=")))
        print(sql)
        self.cursor.execute(sql)
        self.conn.commit()
        return self.cursor.fetchall()

    def execute_raw_sql(self, sql: str):
        print(sql)
        self.cursor.execute(sql)
        self.conn.commit()
        try:
            return self.cursor.fetchall()
        except ProgrammingError:
            return True


if __name__ == "__main__":
    print(Model().bootstrap_tables())
    print(Model().insert_with_constraints("users", {"username": "Bakare", "name": "Bakare Emmanuel", "password": "34s4"}))
    print(Model().update_with_constraints("users", {"username": "Bakare", "name": "Bakare Emmanuel", "password": "34s4"}, {"id": 3, "password": "34s"}))