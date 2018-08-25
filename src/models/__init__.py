"""
Model instance creations for easy imports

"""

from src.models.user import User
from src.models.question import Question
from src.models.answer import Answer
from src.models.comment import Comment

USER_MODEL = User()
QUESTION_MODEL = Question()
ANSWER_MODEL = Answer()
COMMENT_MODEL = Comment()


__all__ = (
    "USER_MODEL",
    "ANSWER_MODEL",
    "QUESTION_MODEL"
)
