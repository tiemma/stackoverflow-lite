# stackoverflow-lite
Stack Overflow Lite repo API implementing CRUD features

[![Build Status](https://travis-ci.org/Tiemma/stackoverflow-lite.svg?branch=master)](https://travis-ci.org/Tiemma/stackoverflow-lite)
[![Maintainability](https://api.codeclimate.com/v1/badges/a82b88aa5147515ce0af/maintainability)](https://codeclimate.com/github/Tiemma/stackoverflow-lite/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a82b88aa5147515ce0af/test_coverage)](https://codeclimate.com/github/Tiemma/stackoverflow-lite/test_coverage)
[![Coverage Status](https://coveralls.io/repos/github/Tiemma/stackoverflow-lite/badge.svg?branch=master)](https://coveralls.io/github/Tiemma/stackoverflow-lite?branch=master)

Code climate badges are currently only on the master branch.

 ## Features
  The following features have been implemented for this project
```
 Models for the following features
  - Comments
  - Answers
  - Questions
  - Users
Helper methods have also been defined to enable good code reuse
```

The following environment variables are also defined in an .env.sample file
```dotenv
NODE_ENV - The node environment configuration for the process
ENABLE_SSL - Boolean value set to true when making connections to ssl databases ie. Heroku PGSql
```

Regarding routes, all endpoints are defined in the #[app.js](server/app.js) file

Various files have been defined in the package.json, a summary of the scripts are
```
npm test
 - Run all tests using mocha and collect coverage reports using istanbl, test runner is nyc
 
npm start 
- For production level run, transpiles ES6 codebase to build and connects to SSL defined heroku PGSql instance. For use on Heroku

npm run dev 
- For development purposes only. ENABLE_SSL is disabled and uses local Postgres instance
```

# DATABASE Setup
 - This project used a Postgres 9.5 server during development.
 All table relationships have been defined in an SQL file named tables.sql accessible in
 the [tables.sql](sql/tables.sql) file. It includes database relationships for
  - Questions
  - Answers
  - Comments
  - User Registration
  
Table rules for managing data were defined and are accessible from there.

# Dev Tools and Configuration
 A docker file has been included to help with running a postgres instance locally 
 without installing the tool suite
 
 The following processes are need to run it successfully
  - Have Docker setup
  - Build the image using 
  ```dotenv
    docker build -t postgres:custom -f Dockerfile.postgres .
  ```
  - You can run the image afterwards using
  ```dotenv
    docker run -p 5432:5432 postgres:custom
  ```
  - If successful, you should be access the postgres instance on port 5432, test with
  ```dotenv
    curl localhost:5432
     OR 
    telnet localhost 5432
   ```
 As regards configuration, all configuration for the node API have been defined in
 a [.env](.env) file for example. 
 All environment variables used have been documented above.
 
# API documentation
Documentation for the APIs has been included for both the node and python variants
although the node API is currently not properly documented due to the timeline for which
development and replication of current features ran for.
All documentation can be referred to better from the python API swagger page 
available on the [python-develop](https://github.com/Tiemma/stackoverflow-lite/tree/python-develop) branch.

```dtd
NOTE: API definitions have changed since the python API was developed, not all functions are 
replicated for use on both sides identically.
API documentation can be referenced from the tests likewise during this period
```
   
# Deployments
A #[.travis.yml](.travis.yml) file has been included for personal use which builds
a CI/CD pipeline for testing and deployment to Heroku. Currently, only the develop 
branch is enabled for deployment.

A code climate repo token is also included for sending code coverage reports.

A postgres addon is being used so no additional database requirements are specified here.

Deployments only happen upon successful testing with 
```dotenv
npm run-script coverage
```

# Errors and HTTP Codes
Both the node and python variants of the API have logging enabled, although 
the python one features file based logging and logging rotation.
Custom errors were defined in both projects for proper error documentation.
They can be viewed in the [errors](server/errors) folder in this current branch.

# UI
The UI for this project was build using the base web stacks
 - CSS
 - HTML
 - Javascript
 along with the reset.css addon for better web browser compatibility.
 
 All code regarding this can be referred from the [UI](UI) and can be referenced in isolation from
 the [UI](https://github.com/Tiemma/stackoverflow-lite/tree/UI) branch
 
# Python API also available!!!
 Due to the note that only Javascript would be allowed for this step,
 the API had been developed to some degree of functionality in Python
 before the Node API was developed.
It includes all the features stated above including comments, JWT authentication and
CORS support. It is accessible in the [python-develop](https://github.com/Tiemma/stackoverflow-lite/tree/python-develop) branch 
and tests for the endpoints are accessible in the [tests](https://github.com/Tiemma/stackoverflow-lite/tree/tests) branch
