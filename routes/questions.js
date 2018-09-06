
import logger from 'debug';
import QuestionModel from '../models/question';
import AnswerModel from '../models/answer';
import { NullError } from '../errors/error';

export default class QuestionRoutes {
  static getLogger() {
    return logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
  }

  static returnCount(req, res) {
    return new QuestionModel().countAllWithConstraints(req.body).then((resp) => {
      QuestionRoutes.getLogger()(`Fetching counts of posts with the following constraints: ${JSON.stringify(req.body)}`);
      res.status(200).json({ resp, success: true });
    }).catch(() => setImmediate(() => {
      QuestionRoutes.getLogger()('Error occurred while fetching counts');
      res.status(500).json({ error: 'Error occurred while fetching counts' });
    }));
  }

  static getQuestions(req, res) {
    return new QuestionModel().selectAll(['*']).then((resp) => {
      QuestionRoutes.getLogger()('Selecting all questions in the database');
      const data = {};
      data.questions = resp.rows;
      res.status(200).json(data);
    });
  }

  static createQuestion(req, res) {
    return new QuestionModel().insert(req.body, ['id']).then((resp) => {
      const data = resp.rows[0];
      QuestionRoutes.getLogger()(`Creating question with the following details: ${JSON.stringify(req.body)}`);
      res.status(201).json({ data, success: true });
    }).catch(err => setImmediate(() => {
      QuestionRoutes.getLogger()(`Error occurred while creating question: ${err}`);
      res.status(500).json({ error: 'Error occurred while creating question' });
    }));
  }

  static fetchCommentsForAnAnswer(req, res, answers) {
    return new Promise(((resolve, reject) => {
      answers.map((answer, i) => {
        QuestionRoutes.getLogger()(`
                Fetching answers and comments with the following id: 
                  Answer id: ${answer.answer.id}
                  Question id: ${req.params.id}
                  `);
        if (answer.answer.id === undefined) {
          res.status(404).json({ answers: [] });
          reject(new NullError(`No answers found for question with id: ${req.params.id}`));
        }
        new AnswerModel().fetchCommentsWithAnswers(answer.answer.id).then((resp) => {
          /**
                   * The username will be null if there is no comment hence assign an empty output
                   * Afterwards, the promise should resolve
                   */
          answers[i].comments = resp[0].user_name ? resp : [];
          if (i === answers.length - 1) {
            resolve(answers);
          }
        })
          .catch(err => setImmediate(() => { reject(err); }));
        return answer;
      });
    }));
  }

  static getQuestionWithAnswersAndComments(req, res) {
    QuestionRoutes.getLogger()(`Fetching questions, answers and comments with the following id: ${req.params.id}`);
    return new QuestionModel().fetchUserAndTheirQuestion(req.params.id)
      .then((question) => {
        new QuestionModel().fetchAnswersFromQuestion(req.params.id)
          .then((answers) => {
            QuestionRoutes.fetchCommentsForAnAnswer(req, res, answers).then((answerWithComments) => {
              const resp = {};
              resp.question = question[0].question;
              resp.answers = answerWithComments;
              res.status(200).json(resp);
            });
          });
      });
  }
}
