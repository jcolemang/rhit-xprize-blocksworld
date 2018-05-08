import psycopg2 as pg
import uuid
import datetime as dt

def connect_to_db(config):
    connection = pg.connect(dbname=config['dbName'],
                            user=config['dbUser'],
                            host=config['dbHost'],
                            port=config['dbPort'])
    return connection

def store_game(db_connection, game_data):
    cursor = db_connection.cursor()

    game_id = str(uuid.uuid4())
    game_query= "INSERT INTO game(id, final_score, start_time, total_time) VALUES(" + _n_values_str(4) + ")"

    start_time = dt.datetime.fromtimestamp(int(game_data['startTime']) / 1e3)
    game_values = (game_id,
                   game_data['finalScore'],
                   start_time,
                   game_data['time'])
    cursor.execute(game_query, game_values)

    block_fronts = {}
    _store_blocks(game_data['initialInfo'], game_id, block_fronts, cursor)

    _store_actions(game_data['actions'], game_id, start_time, block_fronts, cursor)


    db_connection.commit()

def _store_actions(actions, game_id, start_time, block_fronts, cursor):
    for action in actions:
        action_type = action['type']
        if action_type == 'gesture':
            _store_gesture(action, game_id, start_time, cursor)
        elif action_type == 'command':
            _store_command(action, game_id, start_time, cursor)
        elif action_type == 'flip':
            _store_flip(action, game_id, start_time, block_fronts, cursor)
        elif action_type == 'movement':
            _store_movement(action, game_id, start_time, block_fronts, cursor)

def _store_blocks(blocks, game_id, block_fronts, cursor):
    for block in blocks:
        block_id = block['id']
        front_color = block['color']
        front_letter = block['letter']
        block_fronts[block_id] = (front_color, front_letter)

        block_query = "INSERT INTO block(id, game_id, front_color, back_color, front_letter, back_letter) VALUES( " + _n_values_str(6) + ")"
        block_values = (block_id,
                        game_id,
                        front_color,
                        block['flipColor'],
                        front_letter,
                        block['flipLetter'])
        cursor.execute(block_query, block_values)

def _store_gesture(action, game_id, start_time, cursor):
    gesture_id = str(uuid.uuid4())
    time = _datetime_from_string(action['time'])
    time_diff = (time-start_time).total_seconds()
    gesture_query = "INSERT INTO gesture(id, game_id, game_time, x, y) VALUES(" + _n_values_str(5) + ")"
    gesture_values = (gesture_id,
                      game_id,
                      time_diff,
                      action['left_pos'],
                      action['top_pos'])
    cursor.execute(gesture_query, gesture_values)

def _store_command(action, game_id, start_time, cursor):
    command_id = str(uuid.uuid4())
    time = _datetime_from_string(action['time'])
    time_diff = (time-start_time).total_seconds()
    command_query = "INSERT INTO command(id, game_id, game_time, text) VALUES(" + _n_values_str(4) + ")"
    command_values = (command_id,
                      game_id,
                      time_diff,
                      action['text'])
    cursor.execute(command_query, command_values)

def _store_flip(action, game_id, start_time, block_fronts, cursor):
    block_id = action['id']
    flip_id = str(uuid.uuid4())
    time = _datetime_from_string(action['time'])
    time_diff = (time-start_time).total_seconds()
    flip_query = "INSERT INTO flip(id, game_id, game_time, block_id, front_facing, x, y) VALUES(" + _n_values_str(7) + ")"
    flip_values = (flip_id,
                   game_id,
                   time_diff,
                   block_id,
                   block_fronts[block_id] == (action['color'], action['letter']),
                   action['left_pos'],
                   action['top_pos'])
    cursor.execute(flip_query, flip_values)

def _store_movement(action, game_id, start_time, block_fronts, cursor):
    block_id = action['id']
    move_id = str(uuid.uuid4())
    time = _datetime_from_string(action['time'])
    time_diff = (time-start_time).total_seconds()
    move_query = "INSERT INTO move(id, game_id, game_time, block_id, front_facing, start_x, start_y, end_x, end_y) VALUES(" + _n_values_str(9) + ")"
    move_values = (move_id,
                   game_id,
                   time_diff,
                   block_id,
                   block_fronts[block_id] == (action['color'], action['letter']),
                   action['left_pos'],
                   action['top_pos'],
                   action['new_left_pos'],
                   action['new_top_pos'])
    cursor.execute(move_query, move_values)

def _store_survey(db_connection, survey_data):
    cursor = db_connection.cursor()
    cursor.execute("INSERT INTO survey(q1) VALUES(%s)", (survey_data['q1'],))
    db_connection.commit()

def _n_values_str(num_values):
    return "".join(["%s, " for _ in range(num_values - 1)] + ["%s"])

def _datetime_from_string(date_str):
    # js timestamp is in ms, this expects s
    return dt.datetime.strptime(date_str, '%m/%d/%Y %H:%M:%S')
