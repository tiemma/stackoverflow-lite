
import logger from 'debug';
import Model from './model';

export default class Comment extends Model {
  constructor() {
    super('comments');
    this.debug = logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
  }
}

new Comment().selectAll(['*'], Comment.handleResponse);
