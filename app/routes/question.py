"""
Questions namespace definitions for question related actions [Fetch / Submit]
"""

from flask import json, request
from flask_restplus import Resource, fields, Namespace
from flask_restplus._http import HTTPStatus
from psycopg2 import IntegrityError, InternalError

from app.logging import Logger
from app.models import QUESTION_MODEL

QUESTION_NS = Namespace("questions", description="Questions related operations")

POST_FIELDS = {
    'user_id': fields.Integer(required=True, description='The users id'),
    'headline': fields.String(required=True, description='The headline for the question being asked'),
    'description': fields.String(description='Description of the question being asked')
}
POST_MODEL = QUESTION_NS.model('Questions', POST_FIELDS)

LOGGER = Logger.get_logger(__name__)


@QUESTION_NS.route("/<int:id>")
@QUESTION_NS.param('id', 'Question id for easy identification')
@QUESTION_NS.response(HTTPStatus.NOT_FOUND, 'Question not found')
@QUESTION_NS.response(HTTPStatus.OK, 'Question was found')
class QuestionWithId(Resource):
    """
    Question resource class for defining QUESTION related API actions
    """

    def get(self, id):
        """

        :param id:
        :return:
        """
        try:
            payload = {"question_id": id}

            from app.models.model import Model

            answers_schema = ["id", "user_id", "question_id",
                              "headline", "description", "created",
                              "edited", "accepted", "votes"]

            question_schema = ["id", "user_id", "headline",
                               "description", "votes", "created", "edited"]

            answers_with_users = Model.convert_tuple_to_dict(
                QUESTION_MODEL.fetch_user_answers_from_question(payload),
                "answer",
                answers_schema)

            user_with_question = Model.convert_tuple_to_dict(
                QUESTION_MODEL.fetch_user_and_question(payload),
                "question",
                question_schema)

            response = dict()
            response["answers"] = answers_with_users
            response["questions"] = user_with_question

            LOGGER.debug(response)

            return response, HTTPStatus.OK
        except IndexError as err:
            return {"message": str(err)}, 404
        except Exception as err:
            LOGGER.error(err)
            return {"message": "Unknown error occurred"}, 500

    def delete(self, id):
        """

        :param id:
        :return:
        """
        try:
            if not QUESTION_MODEL.delete({"id": id}):
                return {"message": "Question deleted successfully"}, 200
        except IntegrityError as err:
            LOGGER.error(err)
            return {"message": "Internal server error occurred"}, 500


@QUESTION_NS.route("/")
@QUESTION_NS.response(HTTPStatus.NOT_FOUND,
                      'Question not found')
@QUESTION_NS.response(HTTPStatus.OK,
                      'Question was found')
@QUESTION_NS.response(HTTPStatus.INTERNAL_SERVER_ERROR,
                      'Error occurred while performing operation')
class Question(Resource):
    """
    Question resource class for defining QUESTION related API actions
    """

    def get(self):
        """

        :return:
        """
        try:
            response = QUESTION_MODEL.select_all(["*"])
            LOGGER.debug(response)

            return {"message": "All questions recovered successfully",
                    "data": json.dumps(response)}, \
                   HTTPStatus.OK
        except IndexError as err:
            return {"message": str(err)}, 404
        except Exception as err:
            LOGGER.error(err)
            return {"message": "Unknown error occurred"}, 500

    @QUESTION_NS.expect(POST_MODEL, validate=True)
    def post(self):
        """

        :return:
        """
        payload = request.json
        try:
            response = QUESTION_MODEL.insert(payload)[0]
            return {"message": "Question created successfully", "data": response}
        except IntegrityError as err:
            LOGGER.error(err)
            return {"message": "Internal server error occurred"}, 500
        except InternalError as err:
            LOGGER.error(err)
            return {"message": "Transaction has been blacklisted, try again later"}, 500
        except Exception as err:
            LOGGER.error(err)
            return {"message": "Unknown error occurred"}, 500
