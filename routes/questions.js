
import Model from '../models/model';
import QuestionModel from '../models/question';
import AnswerModel from '../models/answer';

export default class Question {
  static async getComments(answerId) {
    const response = await new AnswerModel().fetchCommentsWithAnswers(answerId);
    console.log(`${response}`);
    return response;
  }

  static getQuestionWithAnswersAndComments(id) {
    return new Promise((resolve, reject) => {
      new QuestionModel().fetchUserAndTheirQuestion(id)
        .then((question) => {
          new QuestionModel().fetchAnswersFromQuestion(id)
            .then((answers) => {
              answers = answers.map((answer) => {
                answer.answer.comment = Question.getComments(answer.answer.id);
                return answer;
              });
              console.log(answers[0].answer.comment);
              question.answers = answers;
              resolve(question);
            });
        });
    });
  }
}

Question.getQuestionWithAnswersAndComments(1).then(resp => console.log(resp.answers[0].answer.comment));
