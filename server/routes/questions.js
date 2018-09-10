
import logger from 'debug';
import QuestionModel from '../models/question';
import AnswerModel from '../models/answer';
import CommentModel from '../models/comment';
import { NullError } from '../errors/error';
import { isDuplicate, referenceDoesNotExist } from './helpers';

export default class QuestionRoutes {
  static getLogger(message) {
    return logger(`stackoverflow-api-node:routes/${__filename.split(/[\\/]/).pop()}`)(message);
  }

  static returnCount(req, res) {
    QuestionRoutes.getLogger(`returnCount- Fetching counts of posts with the following constraints: ${JSON.stringify(req.body)}`);
    return new QuestionModel().countAllWithConstraints(req.body).then(
      questionCount => new AnswerModel().countAllWithConstraints(req.body).then(
        answerCount => new CommentModel().countAllWithConstraints(req.body).then((commentCount) => {
          const data = {};
          data.question = questionCount.rows[0];
          data.answer = answerCount.rows[0];
          data.comment = commentCount.rows[0];
          res.status(200).json({ data, success: true });
        }),
      ),
    )
      .catch(() => setImmediate(() => {
        QuestionRoutes.getLogger('returnCount - Error occurred while fetching counts');
        res.status(500).json({ error: 'Error occurred while fetching counts' });
      }));
  }

  static getQuestions(req, res) {
    return new QuestionModel().selectAll(['*']).then((resp) => {
      QuestionRoutes.getLogger('Selecting all questions in the database');
      const data = {};
      data.questions = resp.rows;
      res.status(200).json(data);
    });
  }

  static getRecentQuestions(req, res) {
    const { count } = req.params;
    const sql = `SELECT * FROM questions ORDER BY created DESC LIMIT ${count}`;
    QuestionRoutes.getLogger(`getRecentQuestions - Fetching the ${count} most recent questions`);
    return new QuestionModel().execSQL(sql).then((response) => {
      const data = {};
      data.questions = response.rows;
      res.status(200).json({ data, success: true });
    }).catch(() => setImmediate(() => {
      QuestionRoutes.getLogger('getRecentQuestions - Error occurred while fetching counts');
      res.status(500).json({ error: 'Error occurred while getting recent questions' });
    }));
  }

  static createQuestion(req, res) {
    return new QuestionModel().insert(req.body, ['id']).then((resp) => {
      const data = resp.rows[0];
      QuestionRoutes.getLogger(`Creating question with the following details: ${JSON.stringify(req.body)}`);
      return res.status(201).json({ data, success: true });
    }).catch(err => setImmediate(() => {
      QuestionRoutes.getLogger(`Error occurred while creating question: ${err}`);
      if (isDuplicate(err)) return res.status(409).json({ error: "You can't create a question with the same headline" });
      return res.status(500).json({ error: 'Error occurred while creating question' });
    }));
  }

  static fetchCommentsForAnAnswer(req, res, answers) {
    return new Promise(((resolve, reject) => {
      answers.map((answer, i) => {
        QuestionRoutes.getLogger(`
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
    QuestionRoutes.getLogger(`Fetching questions, answers and comments with the following id: ${req.params.id}`);
    return new QuestionModel().fetchUserAndTheirQuestion(req.params.id)
      .then((question) => {
        QuestionRoutes.getLogger(`Response for question: '${typeof question}'`);
        if (JSON.stringify(question) === '[]') {
          return res.status(404).json({ error: 'Question does not exist' });
        }
        new QuestionModel().fetchAnswersFromQuestion(req.params.id)
          .then((answers) => {
            QuestionRoutes.fetchCommentsForAnAnswer(req, res, answers)
              .then((answerWithComments) => {
                const resp = {};
                resp.question = question[0].question;
                resp.answers = answerWithComments;
                return res.status(200).json(resp);
              });
            // .catch(() => setImmediate(() => {
            // return res.status(404).json({ error: 'Question does not exist' }); }));
          });
      });
  }

  static deleteQuestion(req, res) {
    QuestionRoutes.getLogger(`Deleting a question with the id: ${req.body.id}`);
    const id = req.body.id;
    return new QuestionModel().delete({ id }).then(() => res.status(200).send({ success: true, data: 'Question deleted successfully' })).catch(err => setImmediate(() => {
      if (referenceDoesNotExist(err.message)) {
        return res.status(404).json({ error: 'You can\'t delete a question that doesn\'t exist' });
      }
      return res.status(500).json({ error: 'An error occurred while deleting a question' });
    }));
  }
}
