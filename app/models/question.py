from app.models import Model


class Question(Model):

    TABLE_NAME = "questions"

    def __init__(self) -> None:
        super().__init__()

    @property
    def select_all(self):
        """

        :param table:
        :return:
        """
        return super().select_all(self.TABLE_NAME)

    def select_with_constraints(self, constraints: dict):
        """

        :param table:
        :param constraints:
        :return:
        """
        return super().select_with_constraints(self.TABLE_NAME, ["*"], constraints)

    def fetch_user_question_with_answers(self, constraints: dict):
        SQL = '''SELECT answers, questions, users.name, users.username FROM answers
                    INNER JOIN questions ON answers.question_id = {question_id}
                    INNER JOIN users ON questions.user_id = {user_id}'''.format(**constraints)
        return super().execute_raw_sql(SQL)

    def fetch_all_user_questions(self, constraints: dict):
        SQL = '''SELECT questions, users.name, users.username FROM questions
                            INNER JOIN users ON questions.user_id = {user_id}'''.format(**constraints)
        return super().execute_raw_sql(SQL)


if __name__ == "__main__":
    print(Question().fetch_user_question_with_answers({"user_id": 1, "question_id": "questions.id"}))
    print(Question().fetch_all_user_questions({"user_id": 1}))

