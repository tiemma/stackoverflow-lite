"""
Model instance creations for easy imports

"""

from app.models.user import User
from app.models.question import Question
from app.models.answer import Answer
from app.models.comment import Comment

USER_MODEL = User()
QUESTION_MODEL = Question()
ANSWER_MODEL = Answer()
COMMENT_MODEL = Comment()


__all__ = (
    "USER_MODEL",
    "ANSWER_MODEL",
    "QUESTION_MODEL"
)
