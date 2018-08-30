"""
Bootstrapping point for declaring all the routes defined
"""

from flask_restplus import Api

from src.routes.user import USER_NS
from src.routes.auth import AUTH_NS
from src.routes.question import QUESTION_NS
from src.routes.answer import ANSWER_NS
from src.routes.comment import COMMENT_NS


api = Api(title="Stack Overflow Lite",
          description="""
          This is where the rest endpoints for the application is defined.
          Multiple namespaces have been placed here for ease of reach
          """,
          prefix="/api/v1",
          version="1.0")

api.add_namespace(USER_NS, path="/users")
api.add_namespace(AUTH_NS, path="/auth")
api.add_namespace(QUESTION_NS, path="/questions")
api.add_namespace(ANSWER_NS, path="/questions")
api.add_namespace(COMMENT_NS, path="/questions")


class ApiImpl:

    @staticmethod
    def create_api():
        """

        :return:
        """
        api = Api(title="Stack Overflow Lite",
                  description="""
                  This is where the rest endpoints for the application is defined.
                  Multiple namespaces have been placed here for ease of reach
                  """,
                  prefix="/api/v1",
                  version="1.0")

        api.add_namespace(USER_NS, path="/users")
        api.add_namespace(AUTH_NS, path="/auth")
        api.add_namespace(QUESTION_NS, path="/questions")
        api.add_namespace(ANSWER_NS, path="/questions")
        api.add_namespace(COMMENT_NS, path="/questions")

        return api
