
CREATE TABLE game (
  id int PRIMARY KEY,
  final_score smallint,
  start_time timestamp, -- e.g., 13:13 2018-04-22
  total_time real -- e.g., 112.6 seconds
);

CREATE TABLE survey (
  game_id int REFERENCES game(id),
  q1 varchar(10000),
  q2 varchar(10000),
  q3 varchar(10000)
);

CREATE TABLE block (
  id int,
  game_id int REFERENCES game(id),
  front_color varchar(10),
  back_color varchar(10),
  front_letter char(1),
  back_letter char(1),
  PRIMARY KEY (id, game_id)
);

CREATE TABLE move (
  id int PRIMARY KEY,
  game_id int REFERENCES game(id),
  game_time real,
  block_id smallint,
  front_facing boolean,
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
  front_facing boolean,
  x real,
  y real
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
  gesture_id int REFERENCES gesture(id),
  needed_correction boolean
);

CREATE TABLE flip_data (
  flip_id int REFERENCES flip(id),
  command_id int REFERENCES command(id),
  gesture_id int REFERENCES gesture(id),
  needed_correction boolean
);
