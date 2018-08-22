"""
Bootstrapping point for declaring all the routes defined
"""

from flask_restplus import Api

from app.routes.user import API as USER_API
from app.routes.auth import Register, Login, Logout

API = Api(title="Stack Overflow Lite",
          description="""
          This is where the rest endpoints for the application is defined.
          Multiple namespaces have been placed here for ease of reach
          """,
          prefix="/api/v1",
          version="1.0")

API.add_namespace(USER_API, path="/users")
API.add_namespace(USER_API, path="/users")
