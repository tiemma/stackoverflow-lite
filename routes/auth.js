
import logger from 'debug';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import Config from '../config';

export default class Auth {
  static getLogger() {
    return logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
  }

  static login(req, res) {
    Auth.getLogger()(`Logging in user with username: ${req.body.username}`);

    req.body.password = bcrypt.hashSync(req.body.password, 8);

    new UserModel().selectOne(['id', 'username', 'name']).then((user) => {
      // create a token
      const token = jwt.sign({ id: user.id }, Config('development').KEY, {
        expiresIn: 86400, // expires in 24 hours
      });

      Auth.getLogger()(`Sending token back to user: ${token}`);
      res.status(200).send({ auth: true, token, user: user.rows[0] });
    })
      .catch(() => setImmediate(() => res.status(500).send('There was a problem registering the user.')));
  }

  static register(req, res) {
    Auth.getLogger()(`Registering user with the following id: ${req.body.username}`);

    req.body.password = bcrypt.hashSync(req.body.password, 8);

    new UserModel().insert(req.body, ['id', 'username', 'name']).then((user) => {
      // create a token
      const token = jwt.sign({ id: user.id }, Config('development').KEY, {
        expiresIn: 86400, // expires in 24 hours
      });

      Auth.getLogger()(`Sending token back to user: ${token}`);
      res.status(200).send({ auth: true, token, user: user.rows[0] });
    })
      .catch(() => setImmediate(() => res.status(500).json({ error: 'There was a problem registering the user.' })));
  }

  static verifyToken(req, res, next) {
    Auth.getLogger()(`Fetching request for user with the following details: \n
    Headers: ${JSON.stringify(req.headers)} \n
    Method: ${req.method}`);
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ success: true });
    }

    // decode token
    if (token) {
      // verifies secret and checks token
      jwt.verify(token, Config('development').KEY, (err, decoded) => {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' });
        }
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      });
    } else {
      // if there is no token
      // return an error
      res.status(403).json({
        success: false,
        message: 'No token provided.',
      });
    }
  }
}
