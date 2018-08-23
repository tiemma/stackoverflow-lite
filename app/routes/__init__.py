"""
Bootstrapping point for declaring all the routes defined
"""

from flask_restplus import Api

from app.routes.user import USER_NS
from app.routes.auth import AUTH_NS
from app.routes.question import QUESTION_NS
from app.routes.answer import ANSWER_NS

API = Api(title="Stack Overflow Lite",
          description="""
          This is where the rest endpoints for the application is defined.
          Multiple namespaces have been placed here for ease of reach
          """,
          prefix="/api/v1",
          version="1.0")

API.add_namespace(USER_NS, path="/users")
API.add_namespace(AUTH_NS, path="/auth")
API.add_namespace(QUESTION_NS, path="/questions")
API.add_namespace(ANSWER_NS, path="/questions")
