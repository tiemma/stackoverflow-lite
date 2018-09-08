
import logger from 'debug';
import Model from './model';
import {
  zip, parseStringArray, answerSchema, questionSchema,
} from './helpers';
import { SQLExecError } from '../errors/error';

export default class Question extends Model {
  constructor() {
    super('questions');
    this.debug = logger(`stackoverflow-api-node:models/${__filename.split(/[\\/]/).pop()}`);
  }

  resolveQuestionQueryInPromise(sql) {
    return new Promise((resolve, reject) => {
      this.execSQL(sql).then((resp) => {
        const response = resp.rows.map((questions) => {
          questions.question = zip(parseStringArray(questions.question), questionSchema);
          return questions;
        });
        resolve(response);
      })
        .catch(err => setImmediate(() => { reject(new SQLExecError(`fetchAllUserQuestions - An error occurred: ${err}`)); }));
    });
  }

  fetchAnswersFromQuestion(questionId) {
    const sql = `SELECT  answers as answer ,
        users.name AS user_name,
        users.username AS user_username FROM questions
        LEFT OUTER JOIN answers ON answers.question_id = questions.id
        LEFT OUTER JOIN users ON answers.user_id = users.id
        WHERE questions.id = ${questionId}
        GROUP BY (answers, user_name, user_username, answers.created) ORDER BY answers.created ASC`;

    return new Promise((resolve, reject) => {
      this.execSQL(sql).then((resp) => {
        const response = resp.rows.map((answers) => {
          answers.answer = zip(parseStringArray(answers.answer), answerSchema);
          return answers;
        });
        resolve(response);
      })
        .catch(err => setImmediate(() => { reject(new SQLExecError(`fetchAnswersFromQuestion - An error occurred: ${err}`)); }));
    });
  }

  fetchUserAndTheirQuestion(questionId) {
    const sql = `SELECT distinct questions as question, 
        users.name AS user_name, 
        users.username AS user_username FROM questions
        INNER JOIN users ON questions.user_id = users.id
        WHERE questions.id = ${questionId}`;
    return this.resolveQuestionQueryInPromise(sql);
  }

  fetchAllUserQuestions(userId) {
    const sql = `SELECT questions AS question, 
         users.name AS user_name,
         users.username AS user_username FROM questions
         INNER JOIN users ON questions.user_id = ${userId}`;
    return this.resolveQuestionQueryInPromise(sql);
  }
}

// new QuestionRoutes().fetchUserAndTheirQuestion(1).then(resp => console.log(resp));
