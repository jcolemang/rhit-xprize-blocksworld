
CREATE TABLE game (
  id int PRIMARY KEY,
  final_score smallint,
  total_time real
);

CREATE TABLE human_survey (
  game_id int REFERENCES game(id),
  commander_role boolean,
  worker_role boolean,
  q1 varchar(10000),
  q2 varchar(10000),
  q3 varchar(10000),
  q4 varchar(10000),
  q5 varchar(10000),
  q6 varchar(10000)
);

CREATE TABLE robot_survey (
  game_id int REFERENCES game(id),
  q1 varchar(10000),
  q2 varchar(10000),
  q3 varchar(10000)
);

CREATE TABLE move (
  id int PRIMARY KEY,
  game_id int REFERENCES game(id),
  game_time real,
  block_id smallint,
  start_x real,
  start_y real,
  end_x real,
  end_y real
);

CREATE TABLE flip (
  id int PRIMARY KEY,
  game_id int REFERENCES game(id),
  game_time real,
  block_id smallint,
  start_letter char(1),
  end_letter char(1),
  start_color varchar(10),
  end_color varchar(10)
);

CREATE TABLE command (
  id int PRIMARY KEY,
  game_id int REFERENCES game(id),
  game_time real,
  text varchar(100)
);

CREATE TABLE gesture (
  id int PRIMARY KEY,
  game_id int REFERENCES game(id),
  game_time real,
  x real,
  y real
);

CREATE TABLE move_data (
  move_id int REFERENCES move(id),
  command_id int REFERENCES command(id),
  gesture_id int REFERENCES gesture(id)
);

CREATE TABLE flip_data (
  flip_id int REFERENCES flip(id),
  command_id int REFERENCES command(id),
  gesture_id int REFERENCES gesture(id)
);
