"""
Question model for querying the questions table
"""

from app.models.model import Model


class Question(Model):
    """
    Question class for querying the questions table
    """

    TABLE_NAME = "questions"

    def fetch_user_question_with_answers(self, constraints: dict):
        """

        :param constraints:
        :return:
        """
        sql = '''SELECT answers, questions, users.name, users.username FROM answers
                    INNER JOIN questions ON answers.question_id = {question_id}
                    INNER JOIN users ON questions.user_id = {user_id}'''.format(**constraints)
        return super().execute_raw_sql(sql)

    def fetch_all_user_questions(self, constraints: dict):
        """

        :param constraints:
        :return:
        """
        sql = '''SELECT questions, users.name, users.username FROM questions
                    INNER JOIN users ON questions.user_id = {user_id}'''.format(**constraints)
        return super().execute_raw_sql(sql)


if __name__ == "__main__":
    print(Question().fetch_user_question_with_answers(
        {"user_id": 1, "question_id": "questions.id"}))
    print(Question().fetch_all_user_questions({"user_id": 1}))
