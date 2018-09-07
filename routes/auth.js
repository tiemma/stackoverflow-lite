
import logger from 'debug';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user';
import Config from '../config';

export default class AuthRoutes {
  static getLogger() {
    return logger(`stackoverflow-api-node:${__filename.split(/[\\/]/).pop()}`);
  }

  static login(req, res) {
    AuthRoutes.getLogger()(`Logging in user with username: ${req.body.username}`);

    new UserModel().selectOne(['id', 'username', 'name', 'password'], { username: req.body.username }).then((user) => {
      // create a token
      const data = user.rows;
      if (JSON.stringify(data) === '[]') {
        return res.status(404).json({ error: 'Username does not exist' });
      }

      bcrypt.compare(req.body.password, data[0].password).then((auth) => {
        if (auth === false) {
          return res.status(404).json({ error: 'Username or password combination is incorrect' });
        }
        const token = jwt.sign({ id: user.id }, Config('development').KEY, {
          expiresIn: 86400, // expires in 24 hours
        });

        AuthRoutes.getLogger()(`Sending token back to user: ${token}`);
        delete data[0].password;
        return res.status(200).send({ auth: true, token, user: data[0] });
      });
    })
      .catch(() => setImmediate(() => {
        res.status(500).json({ error: 'There was a problem registering the user' });
      }));
  }

  static register(req, res) {
    AuthRoutes.getLogger()(`Registering user with the following id: ${req.body.username}`);

    req.body.password = bcrypt.hashSync(req.body.password, 8);

    new UserModel().insert(req.body, ['id', 'username', 'name']).then((user) => {
      // create a token
      const token = jwt.sign({ id: user.id }, Config('development').KEY, {
        expiresIn: 86400, // expires in 24 hours
      });

      AuthRoutes.getLogger()(`Sending token back to user: ${token}`);
      res.status(201).send({ auth: true, token, user: user.rows[0] });
    })
      .catch((err) => {
        if (err.message.indexOf('violates unique constraint') > 0) return res.status(409).json({ error: "You've already registered, kindly login" });
        return res.status(500).json({ error: 'There was a problem registering the user.' });
      });
  }

  static verifyToken(req, res, next) {
    AuthRoutes.getLogger()(`Fetching request for user with the following details:
    Headers: ${JSON.stringify(req.headers)}
    Method: ${req.method}`);
    const token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (req.method === 'OPTIONS') {
      return res.status(200).json({ auth: true });
    }

    // decode token
    if (token) {
      // verifies secret and checks token
      jwt.verify(token, Config('development').KEY, (err, decoded) => {
        if (err) {
          return res.json({ auth: false, message: 'Failed to authenticate token.' });
        }
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      });
    } else {
      // if there is no token
      // return an error
      res.status(403).json({
        auth: false,
        message: 'No token provided.',
      });
    }
  }
}
