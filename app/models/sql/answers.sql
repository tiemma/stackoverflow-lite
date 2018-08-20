CREATE TABLE answers(
  id serial PRIMARY KEY ,
  user_id INT PRIMARY KEY,
  question_id INT PRIMARY KEY,
  headline VARCHAR NOT NULL,
  description TEXT NULL,
  created TIMESTAMP NOT NULL DEFAULT now(),
  edited TIMESTAMP NULL,
  accepted INT(1) NOT NULL DEFAULT 0,
  votes INT NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (question_id) REFERENCES questions(id)
);
