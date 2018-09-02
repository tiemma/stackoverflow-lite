import logger from 'debug';
import { parseStringArray, zip, commentSchema } from './helpers';
import Model from './model';

export default class Answer extends Model {
  constructor() {
    super('answers');
    this.debug = logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
  }

  fetchCommentsWithAnswers(answerId, func) {
    const sql = `SELECT  comments as comment,
        users.name AS user_name,
        users.username AS user_username FROM answers
        LEFT OUTER JOIN comments ON comments.answer_id = answers.id
        LEFT OUTER JOIN users ON comments.user_id = users.id
        WHERE answers.id = ${answerId}
        GROUP BY (user_name, user_username, comments.created, comments.votes, comments) 
        ORDER BY comments.created ASC, comments.votes DESC`;
    this.execSQL(sql).then((resp) => {
      const response = resp.rows.map((comments) => {
        comments.comment = zip(parseStringArray(comments.comment), commentSchema);
        return comments;
      });
      this.debug(response);
    });
  }
}

new Answer().fetchCommentsWithAnswers(1, Model.handleResponse);
