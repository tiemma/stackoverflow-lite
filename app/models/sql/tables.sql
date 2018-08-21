DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS answers CASCADE;

CREATE TABLE users(
  id serial NOT NULL PRIMARY KEY,
  name VARCHAR NOT NULL,
  username VARCHAR NOT NULL UNIQUE,
  password VARCHAR NOT NULL,
  created TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE questions(
  id serial NOT NULL UNIQUE ,
  user_id INT NOT NULL,
  headline VARCHAR NOT NULL,
  description TEXT NULL,
  votes INT NOT NULL DEFAULT 0,
  created TIMESTAMP NOT NULL DEFAULT now(),
  edited TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY(id, user_id)
);

CREATE TABLE answers(
  id serial NOT NULL UNIQUE ,
  user_id INT NOT NULL,
  question_id INT NOT NULL,
  headline VARCHAR NOT NULL,
  description TEXT NULL,
  created TIMESTAMP NOT NULL DEFAULT now(),
  edited TIMESTAMP NULL,
  accepted BOOLEAN NOT NULL DEFAULT FALSE,
  votes INT NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  PRIMARY KEY(id, user_id, question_id)
);

-- CREATE RULE questions_edited AS ON UPDATE TO questions DO
--   UPDATE questions SET edited = now() WHERE id = OLD.id AND edited = null;

CREATE RULE questions_deleted AS ON DELETE TO questions
    DO DELETE FROM answers  WHERE question_id = OLD.id;
