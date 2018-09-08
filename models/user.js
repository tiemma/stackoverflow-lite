
import logger from 'debug';
import Model from './model';

export default class User extends Model {
  constructor() {
    super('users');
    this.debug = logger(`stackoverflow-api-node:models/${__filename.split(/[\\/]/).pop()}`);
  }
}

// new User().selectAll(['*'], User.handleResponse);
