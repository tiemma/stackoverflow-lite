CREATE TABLE questions(
  id serial PRIMARY KEY ,
  user_id INT PRIMARY KEY,
  headline VARCHAR NOT NULL,
  description TEXT NULL,
  votes INT NOT NULL DEFAULT 0,
  created TIMESTAMP NOT NULL DEFAULT now(),
  edited TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE RULE questions_edited AS ON UPDATE TO questions DO
  UPDATE questions SET edited = now() WHERE id = OLD.id;

CREATE RULE questions_deleted AS ON DELETE TO questions
    DO DELETE FROM answers  WHERE question_id = OLD.id;