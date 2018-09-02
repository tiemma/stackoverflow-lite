import { NotImplementedError } from './errors/error';

export default function Config(environment) {
  const POSTGRES_USER = 'postgres';
  const POSTGRES_PASSWORD = 'password';
  const POSTGRES_DB = 'stackoverflow';
  const POSTGRES_HOST = 'localhost';
  const POSTGRES_PORT = 5432;
  if (environment === 'development') {
    return {
      POSTGRES_CONFIG: {
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB,
        host: POSTGRES_HOST,
        port: POSTGRES_PORT,
      },
      DATABASE_URI: `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
    };
  }
  throw new NotImplementedError('Environment Configuration does not exist');
}
