
CREATE TABLE ibmdb (
  Time varchar(100),
  Task varchar(100),
  b varchar(100),
  W varchar(100),
  G varchar(100),
  bm varchar(100),
  br varchar(100),
  pn varchar(100),
  pp varchar(100),
  te varchar(100),
  ie varchar(100),
  p varchar(100),
  TimeAndLocation varchar(10000),
  InitialInfo varchar(10000),
  SearchWords varchar(100),
  finalScore varchar(100),
  standard_info varchar(10000)
);

CREATE TABLE human_survey (
  q1 varchar(10000),
  q2 varchar(10000),
  q3 varchar(10000),
  q4 varchar(10000),
  q5 varchar(10000),
  q6 varchar(10000)
);

CREATE TABLE robot_survey (
  q1 varchar(10000),
  q2 varchar(10000),
  q3 varchar(10000)
);
