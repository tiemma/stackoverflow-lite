"""
Answer model for querying the answers table
"""

from src.models.question import Question


class Answer(Question):
    """
    Answer class for the answers table
    """

    TABLE_NAME = "answers"

    def fetch_user_comments_from_answer(self, constraints: dict):
        sql = '''SELECT  comments as comment,
        users.name AS user_name,
        users.username AS user_username FROM answers
        LEFT OUTER JOIN comments ON comments.answer_id = answers.id
        LEFT OUTER JOIN users ON comments.user_id = users.id
        WHERE answers.id = {answer_id}
        GROUP BY (user_name, user_username, comments.created, comments.votes, comments) 
        ORDER BY comments.created ASC, comments.votes DESC'''.format(**constraints)
        return super().execute_raw_sql(sql)