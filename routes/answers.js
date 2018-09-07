import logger from 'debug';
import AnswerModel from '../models/answer';
import QuestionModel from '../models/question';


export default class AnswerRoutes {
  static getLogger(message) {
    return logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`)(message);
  }

  static returnCount(req, res) {
    return new AnswerModel().countAllWithConstraints(req.body).then((resp) => {
      AnswerRoutes.getLogger(`createAnswer - Fetching counts of posts with the following constraints: ${JSON.stringify(req.body)}`);
      const data = resp.rows[0];
      res.status(200).json({ data, success: true });
    }).catch(() => setImmediate(() => {
      AnswerModel.getLogger('createAnswer - Error occurred while fetching counts');
      res.status(500).json({ error: 'Error occurred while fetching counts' });
    }));
  }

  static createAnswer(req, res) {
    AnswerRoutes.getLogger(`createAnswer - Creating answer with the following details: 
    Body: ${JSON.stringify(req.body)}
    Params: ${JSON.stringify(req.params)}`);
    const req_body = req.body;
    req_body.question_id = req.params.id;
    return new AnswerModel().insert(req_body, ['*']).then((resp) => {
      const data = resp.rows[0];
      return res.status(201).json({ data, success: true });
    }).catch(err => setImmediate(() => {
      AnswerRoutes.getLogger(`createAnswer - Error occurred while creating answer: ${err.message}`);
      if (err.message.indexOf('violates foreign key constraint') > 0) return res.status(404).json({ error: "You can't create an answer for a non-existent question" });
      return res.status(409).json({ error: "You can't answer a question twice" });
    }));
  }
}
