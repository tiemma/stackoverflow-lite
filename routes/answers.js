import logger from 'debug';
import AnswerModel from '../models/answer';


export default class AnswerRoutes {
  static getLogger() {
    return logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
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
