
CREATE TABLE game (
  id uuid PRIMARY KEY,
  final_score smallint,
  start_time timestamp, -- e.g., 13:13 2018-04-22
  total_time real -- e.g., 112.6 seconds
);

CREATE TABLE survey (
  game_id uuid REFERENCES game(id),
  q1 varchar(10000),
  q2 varchar(10000),
  q3 varchar(10000)
);

CREATE TABLE block (
  id smallint,
  game_id uuid REFERENCES game(id),
  front_color varchar(10),
  back_color varchar(10),
  front_letter char(1),
  back_letter char(1),
  PRIMARY KEY (id, game_id)
);

CREATE TABLE move (
  id uuid PRIMARY KEY,
  game_id uuid,
  game_time real,
  block_id smallint,
  front_facing boolean,
  start_x real,
  start_y real,
  end_x real,
  end_y real,
  FOREIGN KEY (block_id, game_id) REFERENCES block (id, game_id)
);

CREATE TABLE flip (
  id uuid PRIMARY KEY,
  game_id uuid,
  game_time real,
  block_id smallint,
  front_facing boolean,
  x real,
  y real,
  FOREIGN KEY (block_id, game_id) REFERENCES block (id, game_id)
);

CREATE TABLE command (
  id uuid PRIMARY KEY,
  game_id uuid REFERENCES game(id),
  game_time real,
  text varchar(100)
);

CREATE TABLE gesture (
  id uuid PRIMARY KEY,
  game_id uuid REFERENCES game(id),
  game_time real,
  x real,
  y real
);

CREATE TABLE move_data (
  move_id uuid REFERENCES move(id),
  command_id uuid REFERENCES command(id),
  gesture_id uuid REFERENCES gesture(id),
  needed_correction boolean
);

CREATE TABLE flip_data (
  flip_id uuid REFERENCES flip(id),
  command_id uuid REFERENCES command(id),
  gesture_id uuid REFERENCES gesture(id),
  needed_correction boolean
);
