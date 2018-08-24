"""
Question model for querying the questions table
"""

from typing import List, Dict

from app.models.model import Model


class Question(Model):
    """
    Question class for querying the questions table
    """

    TABLE_NAME = "questions"

    def fetch_user_answers_from_question(self, constraints: dict) -> List[Dict]:
        """

        :param constraints:
        :return:
        """
        sql = '''SELECT distinct answers AS answer, 
        users.name AS user_name, 
        users.username AS user_username FROM questions
        LEFT OUTER JOIN answers ON answers.question_id = questions.id
        LEFT OUTER JOIN users ON answers.user_id = users.id
        WHERE questions.id = {question_id}'''.format(**constraints)
        return super().execute_raw_sql(sql)

    def fetch_user_and_question(self, constraints: dict) -> List[Dict]:
        """

        :param constraints:
        :return:
        """
        sql = '''SELECT distinct questions as question, 
        users.name AS user_name, 
        users.username AS user_username FROM questions
                INNER JOIN users ON questions.user_id = users.id
                WHERE questions.id = {question_id}'''.format(**constraints)
        return super().execute_raw_sql(sql)

    def fetch_all_user_questions(self, constraints: dict) -> List[Dict]:
        """

        :param constraints:
        :return:
        """
        sql = '''SELECT questions, 
         users.name AS user_name,
         users.username AS user_username FROM questions
                    INNER JOIN users ON questions.user_id = {user_id}'''.format(**constraints)
        return super().execute_raw_sql(sql)


if __name__ == "__main__":
    print(Question().fetch_user_and_question(
        {"user_id": 1, "question_id": "questions.id"}))
    print(Question().fetch_all_user_questions({"user_id": 1}))
