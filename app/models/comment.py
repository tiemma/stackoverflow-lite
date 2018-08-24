"""
Answer model for querying the answers table
"""

from app.models.answer import Answer


class Comment(Answer):
    """
    Answer class for the answers table
    """

    TABLE_NAME = "answers"
