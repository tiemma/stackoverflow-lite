import logger from 'debug';
import AnswerModel from '../models/answer';
import { referenceDoesNotExist } from './helpers';


export default class AnswerRoutes {
  static getLogger(message) {
    return logger(`stackoverflow-api-node:routes/${__filename.split(/[\\/]/).pop()}`)(message);
  }

  static returnCount(req, res) {
    AnswerRoutes.getLogger(`returnCount- Fetching counts of posts with the following constraints: ${JSON.stringify(req.body)}`);
    return new AnswerModel().countAllWithConstraints(req.body).then((resp) => {
      const data = resp.rows[0];
      res.status(200).json({ data, success: true });
    }).catch(() => setImmediate(() => {
      AnswerRoutes.getLogger('returnCount - Error occurred while fetching counts');
      res.status(500).json({ error: 'Error occurred while fetching counts' });
    }));
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
