"""
Answers namespace definitions for answer related actions [Fetch / Submit]
"""

from flask import json, request
from flask_restplus import Resource, fields, Namespace, cors
from flask_restplus._http import HTTPStatus

from src.controller import handle_error_message, NoResponseError
from src.logger import Logger
from src.models import ANSWER_MODEL
from src.routes.question import answers_schema

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
@ANSWER_NS.response(HTTPStatus.INTERNAL_SERVER_ERROR,
                    'Error occurred while performing operation')
@ANSWER_NS.response(HTTPStatus.LOOP_DETECTED,
                    "Transaction kept throwing errors and got blacklisted")
class Answer(Resource):
    """
    Answer resource class for defining ANSWER related API actions
    """

    @cors.crossdomain(origin='*')
    def get(self, id: int):
        """

        :param id:
        :return:
        """
        try:
            response = ANSWER_MODEL.fetch_user_answers_from_question({"question_id": id})
            parsed_answer = ANSWER_MODEL.convert_tuple_to_dict(response,
                                                             "answer",
                                                             answers_schema)
            LOGGER.debug(parsed_answer)

            if not parsed_answer[0]['answer']:
                return handle_error_message(NoResponseError)
            for i in range(len(parsed_answer)):
                parsed_answer[i]["answer"]["description"] = parsed_answer[i]["answer"]["description"].replace("~>", ",")
            return parsed_answer, HTTPStatus.OK
        except Exception as err:
            return handle_error_message(err)

    @ANSWER_NS.expect(ANSWER_POST_MODEL, validate=True)
    def post(self, id: int):
        """

        :return:
        """
        payload = request.json
        payload["question_id"] = id
        payload["description"] = payload["description"].replace(",", "~>")
        try:
            response = ANSWER_MODEL.insert(payload)[0]
            return {"message": "Answer created successfully", "data": response}, HTTPStatus.CREATED
        except Exception as err:
            return handle_error_message(err)


@ANSWER_NS.route("/<int:question_id>/answers/<int:answer_id>")
@ANSWER_NS.param('question_id',
                 'Question ID number')
@ANSWER_NS.param('answer_id',
                 'Answer ID number')
@ANSWER_NS.response(HTTPStatus.NOT_FOUND,
                    'Answer not found')
@ANSWER_NS.response(HTTPStatus.OK,
                    'Answer was found')
@ANSWER_NS.response(HTTPStatus.LOOP_DETECTED,
                    "Transaction kept throwing errors and got blacklisted")
class AnswerWithId(Resource):
    """
    Answer resource class for defining ANSWER related API actions
    relating to an ID
    """
    def put(self, question_id: int, answer_id: int):
        """

        :param question_id:
        :param answer_id:
        :return:
        """
        payload = request.json or dict()
        payload["question_id"] = question_id
        payload["id"] = answer_id
        try:
            updating_data = {"accepted": True}
            response = ANSWER_MODEL.update(updating_data, payload, ["question_id"])

            if not response:
                return handle_error_message(NoResponseError)

            return {"message": "Answer has been accepted successfully",
                    "data": response}, HTTPStatus.OK
        except Exception as err:
            return handle_error_message(err)
