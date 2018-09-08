import { NotImplementedError } from './errors/error';

export default function Config(environment) {
  if (environment === 'development') {
    const POSTGRES_USER = 'postgres';
    const POSTGRES_PASSWORD = 'password';
    const POSTGRES_DB = 'stackoverflow';
    const POSTGRES_HOST = 'localhost';
    const POSTGRES_PORT = 5432;
    const SECRET_KEY = 'UFsUQbQvpjsXXCJSPeUkFx7y';
    return {
      POSTGRES_CONFIG: {
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
      },
      DATABASE_URI: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
      KEY: SECRET_KEY,
    };
  } if (environment === 'production') {
    const POSTGRES_USER = 'mvhrzhwzjsnirn';
    const POSTGRES_PASSWORD = '39d864300ddd875057ba83c36bf8d7ba93c1d6dbbfd76fab45ca46e9b9bd6a68';
    const POSTGRES_DB = 'd2chfamp9re8r1';
    const POSTGRES_HOST = 'ec2-54-221-237-246.compute-1.amazonaws.com';
    const POSTGRES_PORT = 5432;
    const SECRET_KEY = 'UFsUQbQvpjsXXCJSPeUkFx7ymvhrzhwzjsnirnd2chfamp9re8r1';
    return {
      POSTGRES_CONFIG: {
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
      },
      DATABASE_URI: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
      KEY: SECRET_KEY,
    };
  }
  throw new NotImplementedError(`Environment configuration '${environment}' does not exist`);
}
