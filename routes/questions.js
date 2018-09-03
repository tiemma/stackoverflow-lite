
import Model from '../models/model';
import QuestionModel from '../models/question';
import AnswerModel from '../models/answer';
import { SQLExecError } from '../errors/error';

export default class Question {
  static getQuestions(req, res) {
    return new QuestionModel().selectAll(['*']).then((resp) => {
      const data = {};
      data.data = resp.rows;
      res.send(data);
    });
  }

  static getQuestionWithAnswersAndComments(req, res) {
    return new QuestionModel().fetchUserAndTheirQuestion(req.params.id)
      .then((question) => {
        new QuestionModel().fetchAnswersFromQuestion(req.params.id)
          .then((answers) => {
            new Promise(((resolve, reject) => {
              answers.map((answer, i) => {
                new AnswerModel().fetchCommentsWithAnswers(answer.answer.id).then((resp) => {
                  answers[i].comments = resp[0].user_name ? resp : [];
                  if (i === answers.length - 1) {
                    resolve(answers);
                  }
                })
                  .catch(err => setImmediate(() => {
                    reject(err);
                    res.status(404).send({ answers });
                  }));
              });
            })).then((answers) => {
              const resp = {};
              resp.question = question[0].question;
              resp.answers = answers;
              res.send(resp);
            });
          });
      });
  }
}
