import express from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import {
  initialise, compile, json, common,
} from 'swagger-spec-express';
import { serve, setup } from 'swagger-ui-express';
import { config } from 'dotenv';
import packageJson from './package.json';
import QuestionRoutes from './routes/questions';
import AuthRoutes from './routes/auth';
import AnswerRoutes from './routes/answers';

const URL_PREFIX = '/api/v1';

const app = express();
const options = {
  title: packageJson.name,
  version: packageJson.version,
  explorer: true,
};
common.parameters.addBody({
  name: 'registration',
  description: 'Schema of the data for users to be registered',
  required: true,
  schema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
      },
      username: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
  },
});

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
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Access-Token');
  next();
});

app.use(new RegExp(`${URL_PREFIX}/(?!auth).*`, 'i'), AuthRoutes.verifyToken);

// Stub route for validating JWT tokens
app.get(`${URL_PREFIX}/verify/token`, (req, res) => res.status(200).json({ auth: true }));

app.post(`${URL_PREFIX}/auth/login`, AuthRoutes.login);

app.post(`${URL_PREFIX}/auth/register`, AuthRoutes.register)
  .describe({
    tags: ['AuthRoutes'],
    consumes: ['application/json'],
    produces: ['application/json'],
    common: {
      parameters: {
        body: ['registration'],
      },
    },
    responses: {
      201: {
        description: 'Created user and returned a valid json response with the user token and registration details',
      },
      500: {
        description: 'Internal server error occurred',
      },
    },
  });

app.get(`${URL_PREFIX}/questions/:id`, QuestionRoutes.getQuestionWithAnswersAndComments)
  .describe({
    tags: ['Questions'],
    responses: {
      200: {
        description: 'Returns a valid json response',
      },
      404: {
        description: 'AnswerRoutes / Comments were not found',
      },
    },
  });

app.get(`${URL_PREFIX}/questions`, QuestionRoutes.getQuestions).describe({
  tags: ['Questions'],
  responses: {
    200: {
      description: 'Returns a valid json response',
    },
    404: {
      description: 'No question was found',
    },
  },
});

app.post(`${URL_PREFIX}/questions`, QuestionRoutes.createQuestion).describe({
  tags: ['Questions'],
  responses: {
    200: {
      description: 'Returns a valid json response',
    },
    500: {
      description: 'No question was found',
    },
  },
});

app.post(`${URL_PREFIX}/questions/all/count`, QuestionRoutes.returnCount).describe({
  tags: ['Questions'],
  responses: {
    200: {
      description: 'Returns a valid json response',
    },
    500: {
      description: 'No question was found',
    },
  },
});

app.post(`${URL_PREFIX}/answers/all/count`, AnswerRoutes.returnCount).describe({
  tags: ['Questions'],
  responses: {
    200: {
      description: 'Returns a valid json response',
    },
    500: {
      description: 'No question was found',
    },
  },
});


app.post(`${URL_PREFIX}/questions/:id/answers`, AnswerRoutes.createAnswer).describe({
  tags: ['AnswerRoutes'],
  responses: {
    200: {
      description: 'Returns a valid json response',
    },
    500: {
      description: 'No question was found',
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

// Route doesn't exist
app.use((req, res) => {
  res.sendStatus(404);
});


export default app;
