"""
Answers namespace definitions for answer related actions [Fetch / Submit]
"""

from flask import json, request
from flask_restplus import Resource, fields, Namespace
from flask_restplus._http import HTTPStatus
from psycopg2 import IntegrityError, InternalError

from app.logging import Logger
from app.models import ANSWER_MODEL

ANSWER_NS = Namespace("answers", description="Answers related operations")

ANSWER_POST_FIELDS = {
    'user_id': fields.Integer(required=True, description='The users id'),
    'question_id': fields.Integer(required=True, description='The questions id'),
    'headline': fields.String(required=True, description='The headline of the question asked'),
    'description': fields.String(required=True, description='Content of the answer')
}

ANSWER_POST_MODEL = ANSWER_NS.model('Answers', ANSWER_POST_FIELDS)

LOGGER = Logger.get_logger(__name__)


@ANSWER_NS.route("/<int:id>/answers")
@ANSWER_NS.param('id', 'Question id for easy identification')
@ANSWER_NS.response(HTTPStatus.NOT_FOUND, 'Answer not found')
@ANSWER_NS.response(HTTPStatus.OK, 'Answer was found')
class Answer(Resource):
    """
    Answer resource class for defining ANSWER related API actions
    """

    def get(self, id):
        """

        :param id:
        :return:
        """
        try:
            response = ANSWER_MODEL.fetch_all_user_questions({"question_id": id})
            LOGGER.debug(response)

            return json.dumps(response), HTTPStatus.OK
        except IndexError as err:
            return {"message": str(err)}, 404
        except Exception as err:
            LOGGER.error(err)
            return {"message": "Unknown error occurred"}, 500

    @ANSWER_NS.expect(ANSWER_POST_MODEL, validate=True)
    def post(self, id):
        """

        :return:
        """
        payload = request.json
        payload["question_id"] = id
        try:
            response = ANSWER_MODEL.insert(payload)[0]
            return {"message": "Answer created successfully", "data": response}
        except IntegrityError as err:
            LOGGER.error(err)
            return {"message": "Internal server error occurred"}, 500
        except InternalError as err:
            LOGGER.error(err)
            return {"message": "Transaction has been blacklisted, try again later"}, 500
        except Exception as err:
            LOGGER.error(err)
            return {"message": "Unknown error occurred"}, 500

@ANSWER_NS.route("/<int:id>/answers")
@ANSWER_NS.param('id', 'Question id for easy identification')
@ANSWER_NS.response(HTTPStatus.NOT_FOUND, 'Answer not found')
@ANSWER_NS.response(HTTPStatus.OK, 'Answer was found')
class AnswerWithId(Resource):
    """
    Answer resource class for defining ANSWER related API actions
    """