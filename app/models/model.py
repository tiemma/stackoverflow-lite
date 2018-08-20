from app.config import POSTGRES_CONFIG
from os import listdir
import psycopg2

class Model:
    def __init__(self):
        self.conn = Model.init_conn()

    @staticmethod
    def init_conn():
        return psycopg2.connect(**POSTGRES_CONFIG)

    def bootstrap_tables(self):
        dir_ext = "sql/"
        sql_files = [f for f in listdir(dir_ext) if "sql" in f]
        for f in sql_files:
            with open(dir_ext+f, 'r') as o:
                self.conn.execute("".join(o.readlines()))
        # self.conn.execute()

    def select_all(self, table: str):
        SQL = "SELECT * FROM {table} WHERE 1".format(table=table)
        return


if __name__ == "__main__":
    print(Model().bootstrap_tables())