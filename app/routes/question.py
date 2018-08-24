"""
Questions namespace definitions for question related actions [Fetch / Submit]
"""

from flask import json, request
from flask_restplus import Resource, fields, Namespace
from flask_restplus._http import HTTPStatus

from app.controller import handle_error_message, NoResponseError
from app.logging import Logger
from app.models import QUESTION_MODEL, ANSWER_MODEL

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

        comment_schema = ["id", "user_id", "question_id", "answer_id",
                          "comment", "votes", "created", "edited"]

        answers_data = QUESTION_MODEL.fetch_user_answers_from_question(payload)

        questions_data = QUESTION_MODEL.fetch_user_and_question(payload)

        response = dict()

        if not questions_data:
            return handle_error_message(NoResponseError)

        user_with_question = Model.convert_tuple_to_dict(questions_data,
                                                         "question",
                                                         question_schema)

        response["question"] = user_with_question[0]['question']

        if answers_data[0]["answer"]:
            answers_with_users = Model.convert_tuple_to_dict(answers_data,
                                                             "answer",
                                                             answers_schema)
            answers_with_comments = list()
            for answer in answers_with_users:
                comments_data = ANSWER_MODEL.fetch_user_comments_from_answer({"answer_id": answer["answer"]["id"]})
                comments_with_users = Model.convert_tuple_to_dict(comments_data,
                                                                  "comment",
                                                                  comment_schema)
                answer["comments"] = comments_with_users

                answers_with_comments.append(answer)

            response["answers"] = answers_with_comments

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
