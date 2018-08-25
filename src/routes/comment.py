"""
Answers namespace definitions for answer related actions [Fetch / Submit]
"""

from flask import json, request
from flask_restplus import Resource, fields, Namespace
from flask_restplus._http import HTTPStatus

from src.controller import handle_error_message, NoResponseError
from src.logger import Logger
from src.models import COMMENT_MODEL

COMMENT_NS = Namespace("comments", description="Comment related operations")

COMMENT_POST_FIELDS = {
    'user_id': fields.Integer(required=True, description='The users id'),
    'question_id': fields.Integer(required=True, description='The questions id'),
    'answer_id': fields.Integer(required=True, description='The answers id'),
    'comment': fields.String(required=True, description='Content of the comment')
}

COMMENT_POST_MODEL = COMMENT_NS.model('Comments', COMMENT_POST_FIELDS)

LOGGER = Logger.get_logger(__name__)


@COMMENT_NS.route("/<int:question_id>/answers/<int:answer_id>/comments")
@COMMENT_NS.param('id', 'Question id for easy identification')
@COMMENT_NS.response(HTTPStatus.NOT_FOUND, 'Comment not found')
@COMMENT_NS.response(HTTPStatus.OK, 'Comment was found')
@COMMENT_NS.response(HTTPStatus.INTERNAL_SERVER_ERROR,
                     'Error occurred while performing operation')
@COMMENT_NS.response(HTTPStatus.LOOP_DETECTED,
                     "Transaction kept throwing errors and got blacklisted")
class Comment(Resource):
    """
    Comment resource class for defining COMMENT related API actions
    """

    def get(self, question_id: int, answer_id: int):
        """

        :param id:
        :return:
        """
        try:
            response = COMMENT_MODEL.fetch_user_answers_from_question({"question_id": id})
            LOGGER.debug(response)

            if not response[0]['answer']:
                return handle_error_message(NoResponseError)

            return json.dumps(response), HTTPStatus.OK
        except Exception as err:
            return handle_error_message(err)

    @COMMENT_NS.expect(COMMENT_POST_MODEL, validate=True)
    def post(self, question_id: int, answer_id: int):
        """

        :return:
        """
        payload = request.json
        payload["question_id"] = question_id
        payload["answer_id"] = answer_id
        try:
            response = COMMENT_MODEL.insert(payload)[0]
            return {"message": "Comment created successfully", "data": response}, HTTPStatus.CREATED
        except Exception as err:
            return handle_error_message(err)


@COMMENT_NS.route("/<int:question_id>/answers/<int:answer_id>/comments/<int:comment_id>")
@COMMENT_NS.param('question_id',
                  'Question ID number')
@COMMENT_NS.param('answer_id',
                  'Comment ID number')
@COMMENT_NS.param('comment_id',
                  'Comment ID number')
@COMMENT_NS.response(HTTPStatus.NOT_FOUND,
                     'Comment not found')
@COMMENT_NS.response(HTTPStatus.OK,
                     'Comment was found')
@COMMENT_NS.response(HTTPStatus.LOOP_DETECTED,
                     "Transaction kept throwing errors and got blacklisted")
class CommentWithId(Resource):
    """
    Comment resource class for defining COMMENT related API actions
    relating to an ID
    """
    def put(self, question_id: int, answer_id: int, comment_id: int):
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
            response = COMMENT_MODEL.update(updating_data, payload, ["question_id, answer_id"])

            if not response:
                return handle_error_message(NoResponseError)

            return {"message": "Comment has been updated successfully",
                    "data": response}, HTTPStatus.OK
        except Exception as err:
            return handle_error_message(err)
