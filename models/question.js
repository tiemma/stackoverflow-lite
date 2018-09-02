
import logger from 'debug';
import Model from './model';
import { zip,parseStringArray, answerSchema, questionSchema } from './helpers';

export default class Question extends Model {
  constructor() {
    super('questions');
    this.debug = logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
  }

  fetchAnswersFromQuestion(questionId, func) {
    const sql = `SELECT  answers as answer ,
        users.name AS user_name,
        users.username AS user_username FROM questions
        LEFT OUTER JOIN answers ON answers.question_id = questions.id
        LEFT OUTER JOIN users ON answers.user_id = users.id
        WHERE questions.id = ${questionId}
        GROUP BY (answers, user_name, user_username, answers.created) ORDER BY answers.created ASC`;

    this.execSQL(sql).then((resp) => {
      const response = resp.rows.map((answers) => {
        answers.comment = zip(parseStringArray(answers.comment), answerSchema);
        return answers;
      });
      this.debug(response);
    });
  }

  fetchUserAndTheirQuestion(questionId, func) {
    const sql = `SELECT distinct questions as question, 
        users.name AS user_name, 
        users.username AS user_username FROM questions
        INNER JOIN users ON questions.user_id = users.id
        WHERE questions.id = ${questionId}`;
    this.execSQL(sql).then((resp) => {
      const response = resp.rows.map((questions) => {
        questions.question = zip(parseStringArray(questions.question), questionSchema);
        return questions;
      });
      this.debug(response);
    });
  }

  fetchAllUserQuestions(userId, func) {
    const sql = `SELECT questions AS question, 
         users.name AS user_name,
         users.username AS user_username FROM questions
         INNER JOIN users ON questions.user_id = ${userId}`;
    this.execSQL(sql).then((resp) => {
      const response = resp.rows.map((questions) => {
        questions.question = zip(parseStringArray(questions.question), questionSchema);
        return questions;
      });
      this.debug(response);
    });
  }
}

// new Question().fetchAllUserQuestions(1, Question.handleResponse);
