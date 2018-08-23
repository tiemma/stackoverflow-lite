"""
Questions namespace definitions for question related actions [Fetch / Submit]
"""

from flask import json, request
from flask_restplus import Resource, fields, Namespace
from flask_restplus._http import HTTPStatus
from psycopg2 import IntegrityError, InternalError

from app.logging import Logger
from app.models import QUESTION_MODEL, ANSWER_MODEL

QUESTION_NS = Namespace("questions", description="Questions related operations")

POST_FIELDS = {
    'user_id': fields.Integer(required=True, description='The users name'),
    'headline': fields.String(required=True, description='The users pet name'),
    'description': fields.String(description='Question password sent on signup and login')
}
POST_MODEL = QUESTION_NS.model('Questions', POST_FIELDS)

logger = Logger.get_logger(__name__)


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
            answers_schema = ["id", "user_id", "question_id", "headline", "description", "created", "edited", "accepted", "votes"]
            question_schema = ["id", "user_id", "headline", "description", "votes", "created", "edited"]
            answers_with_users = Model.convert_tuple_to_dict(QUESTION_MODEL.fetch_user_answers_from_question(payload), "answer", answers_schema)
            user_with_question = Model.convert_tuple_to_dict(QUESTION_MODEL.fetch_user_and_question(payload), "question", question_schema)

            response = dict()
            response["answers"] = answers_with_users
            response["questions"] = user_with_question

            logger.debug(response)

            return response, HTTPStatus.OK
        except IndexError as e:
            return {"message": str(e)}, 404
        except Exception as e:
            logger.error(e)
            return {"message": "Unknown error occurred"}, 500

    def delete(self, id):
        """

        :param id:
        :return:
        """
        try:
            QUESTION_MODEL.delete({"id": id})
        except IntegrityError as e:
            logger.error(e)
            return {"message": "Internal server error occurred"}, 500


ANSWER_NS = Namespace("answers", description="Answers related operations")

ANSWER_POST_FIELDS = {
    'user_id': fields.Integer(required=True, description='The users name'),
    'question_id': fields.Integer(required=True, description='The users name'),
    'headline': fields.String(required=True, description='The users pet name'),
    'description': fields.String(required=True,description='Answer password sent on signup and login')
}
ANSWER_POST_MODEL = ANSWER_NS.model('Answers', POST_FIELDS)


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
            response = ANSWER_MODEL.fetch_user_question_with_answers({"question_id": id})
            logger.debug(response)

            return json.dumps(response), HTTPStatus.OK
        except IndexError as e:
            return {"message": str(e)}, 404
        except Exception as e:
            logger.error(e)
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
        except IntegrityError as e:
            logger.error(e)
            return {"message": "Internal server error occurred"}, 500
        except InternalError as e:
            logger.error(e)
            return {"message": "Transaction has been blacklisted, try again later"}, 500
        except Exception as e:
            logger.error(e)
            return {"message": "Unknown error occurred"}, 500


@QUESTION_NS.route("/")
@QUESTION_NS.response(HTTPStatus.NOT_FOUND, 'Question not found')
@QUESTION_NS.response(HTTPStatus.OK, 'Question was found')
@QUESTION_NS.response(HTTPStatus.INTERNAL_SERVER_ERROR, 'Error occurred while performing operation')
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
            logger.debug(response)

            return {"message": "All questions recovered successfully", "data": json.dumps(response)}, HTTPStatus.OK
        except IndexError as e:
            return {"message": str(e)}, 404
        except Exception as e:
            logger.error(e)
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
        except IntegrityError as e:
            logger.error(e)
            return {"message": "Internal server error occurred"}, 500
        except InternalError as e:
            logger.error(e)
            return {"message": "Transaction has been blacklisted, try again later"}, 500
        except Exception as e:
            logger.error(e)
            return {"message": "Unknown error occurred"}, 500
