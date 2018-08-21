"""
Model instance creations for easy imports

"""

from app.models.user import User
from app.models.question import Question
from app.models.answer import Answer

USER_MODEL = User()
QUESTION_MODEL = Question()
ANSWER_MODEL = Answer()

__all__ = (
    "USER_MODEL",
    "ANSWER_MODEL",
    "QUESTION_MODEL"
)
