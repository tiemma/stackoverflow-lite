import logger from 'debug';
import AnswerModel from '../models/answer';
import QuestionModel from '../models/question';


export default class AnswerRoutes {
  static getLogger() {
    return logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
  }

  static returnCount(req, res) {
    return new AnswerModel().countAllWithConstraints(req.body).then((resp) => {
      AnswerRoutes.getLogger()(`Fetching counts of posts with the following constraints: ${JSON.stringify(req.body)}`);
      res.status(200).json({ resp, success: true });
    }).catch(() => setImmediate(() => {
      AnswerModel.getLogger()('Error occurred while fetching counts');
      res.status(500).json({ error: 'Error occurred while fetching counts' });
    }));
  }

  static createAnswer(req, res) {
    AnswerRoutes.getLogger()(`Creating answer with the following details: 
    Body: ${JSON.stringify(req.body)}
    Params: ${JSON.stringify(req.params)}`);
    req.body.question_id = req.params.id;
    new AnswerModel().insert(req.body, ['*']).then((resp) => {
      const data = resp.rows[0];
      res.status(201).json({ data, success: true });
    }).catch(() => {
      res.status(409).json({ error: "You can't answer a question twice" });
    });
  }
}
