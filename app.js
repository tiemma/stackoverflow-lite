import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { initialise, compile, json } from 'swagger-spec-express';
import { serve, setup } from 'swagger-ui-express';
import { config } from 'dotenv';
import packageJson from './package.json';


const app = express();
const options = {
  title: packageJson.name,
  version: packageJson.version,
  explorer: true,
};

// Load .env file into current process scope
config();

// Swagger initialisation
initialise(app, options);

// Express level inits and route configs
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('/swagger.json', (err, res) => {
  res.status(200).json(json());
}).describe({
  operationId: 'Swagger Docs',
  responses: {
    200: {
      description: 'Returns the swagger.json document',
    },
  },
});


// Swagger spec compilations and swagger UI inits
compile();
app.use('/', serve, setup(json()));


export default { app };
