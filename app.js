import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { initialise, compile, json } from 'swagger-spec-express';
import { serve, setup } from 'swagger-ui-express';
import { config } from 'dotenv';
import packageJson from './package.json';
import Question from './routes/questions';


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

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/api/v1/questions/:id', Question.getQuestionWithAnswersAndComments)
  .describe({
    tags: ['Questions'],
    responses: {
      200: {
        description: 'Returns a valid json response',
      },
      404: {
        description: 'Answers / Comments were not found',
      },
    },
  });

app.get('/api/v1/questions', Question.getQuestions).describe({
    tags: ['Questions'],
  responses: {
    200: {
      description: 'Returns a valid json response',
    },
    404: {
      description: 'Questions have been found',
    },
  },
});

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


export default app;
