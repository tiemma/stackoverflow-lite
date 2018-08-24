"""
Questions namespace definitions for question related actions [Fetch / Submit]
"""

from flask import json, request
from flask_restplus import Resource, fields, Namespace
from flask_restplus._http import HTTPStatus

from app.controller import handle_error_message, NoResponseError
from app.logging import Logger
from app.models import QUESTION_MODEL

QUESTION_NS = Namespace("questions",
                        description="Questions related operations")

POST_FIELDS = {
    'user_id': fields.Integer(required=True,
                              description='The users id'),
    'headline': fields.String(required=True,
                              description='The headline for the question being asked'),
    'description': fields.String(description='Description of the question being asked')
}
POST_MODEL = QUESTION_NS.model('Questions', POST_FIELDS)

LOGGER = Logger.get_logger(__name__)


@QUESTION_NS.route("/<int:id>")
@QUESTION_NS.param('id',
                   'Question id for easy identification')
@QUESTION_NS.response(HTTPStatus.NOT_FOUND,
                      'Question not found')
@QUESTION_NS.response(HTTPStatus.OK,
                      'Question was found')
@QUESTION_NS.response(HTTPStatus.LOOP_DETECTED,
                      "Transaction kept throwing errors and got blacklisted")
class QuestionWithId(Resource):
    """
    Question resource class for defining QUESTION related API actions
    """

    def get(self, id: int):
        """

        :param id:
        :return:
        """
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

        if not user_with_question[0]["question"]:
            return handle_error_message(NoResponseError)

        response = dict()
        response["answers"] = answers_with_users
        response["questions"] = user_with_question

        LOGGER.debug(response)

        return response, HTTPStatus.OK

    def delete(self, id: int):
        """

        :param id:
        :return:
        """
        try:
            if not QUESTION_MODEL.delete({"id": id}):
                return {"message": "Question deleted successfully"}, HTTPStatus.OK
        except Exception as err:
            return handle_error_message(err)


@QUESTION_NS.route("/")
@QUESTION_NS.response(HTTPStatus.NOT_FOUND,
                      'Question not found')
@QUESTION_NS.response(HTTPStatus.OK,
                      'Question was found')
@QUESTION_NS.response(HTTPStatus.INTERNAL_SERVER_ERROR,
                      'Error occurred while performing operation')
@QUESTION_NS.response(HTTPStatus.LOOP_DETECTED,
                      "Transaction kept throwing errors and got blacklisted")
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
            LOGGER.debug(json.dumps(response))

            if not response:
                return handle_error_message(NoResponseError)

            return {"message": "All questions recovered successfully",
                    "data": json.dumps(response)}, HTTPStatus.OK
        except Exception as err:
            return handle_error_message(err)

    @QUESTION_NS.expect(POST_MODEL, validate=True)
    def post(self):
        """

        :return:
        """
        payload = request.json
        try:
            response = QUESTION_MODEL.insert(payload)[0]
            return {"message": "Question created successfully",
                    "data": response}, HTTPStatus.CREATED
        except Exception as err:
            return handle_error_message(err)
