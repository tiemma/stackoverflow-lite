import logger from 'debug';
import AnswerModel from '../models/answer';
import { referenceDoesNotExist } from './helpers';
import { zip, questionSchema, parseStringArray } from '../models/helpers';


export default class AnswerRoutes {
  static getLogger(message) {
    return logger(`stackoverflow-api-node:routes/${__filename.split(/[\\/]/).pop()}`)(message);
  }

  static getMostAnsweredQuestionPerUser(req, res) {
    AnswerRoutes.getLogger(`getMostAnsweredQuestionPerUser - Getting the most answered questions for a user with the following details: 
    Body: ${JSON.stringify(req.body)}
    Params: ${JSON.stringify(req.params)}`);
    return new AnswerModel().fetchMostCommonAnswers(req.params.count, req.body.user_id)
      .then((resp) => {
        const data = {};
        data.questions = resp.rows.map(
          (question) => {
            const data = zip(parseStringArray(question.questions), questionSchema);
            data.count = question.questioncount;
            return data;
          },
        );
        AnswerRoutes.getLogger(`getMostAnsweredQuestionPerUser - Final response after zipping: ${JSON.stringify(data)}`);
        res.status(200).json({ data, success: true });
      });
  }

  static createAnswer(req, res) {
    AnswerRoutes.getLogger(`createAnswer - Creating answer with the following details: 
    Body: ${JSON.stringify(req.body)}
    Params: ${JSON.stringify(req.params)}`);
    req.body.question_id = req.params.id;
    return new AnswerModel().insert(req.body, ['*']).then((resp) => {
      const data = resp.rows[0];
      return res.status(201).json({ data, success: true });
    }).catch(err => setImmediate(() => {
      AnswerRoutes.getLogger(`createAnswer - Error occurred while creating answer: ${err.message}`);
      if (referenceDoesNotExist(err)) return res.status(404).json({ error: "You can't create an answer for a non-existent question" });
      return res.status(409).json({ error: "You can't answer a question twice" });
    }));
  }
}
