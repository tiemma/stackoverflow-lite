"""
Answer model for querying the answers table
"""

from app.models.question import Question


class Answer(Question):
    """
    Answer class for the answers table
    """

    TABLE_NAME = "answers"
