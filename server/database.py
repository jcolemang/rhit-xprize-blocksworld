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
    game_query= "INSERT INTO game(id, final_score, start_time, total_time) VALUES(" + n_values_str(4) + ")"


    game_values = (game_id,
                   game_data['finalScore'],
                   dt.datetime.fromtimestamp(int(game_data['startTime']) / 1e3),
                   game_data['time'])
    cursor.execute(game_query, game_values)

    block_fronts = {}
    for block in game_data['initialInfo']:
        block_id = block['id']
        front_color = block['color']
        front_letter = block['letter']
        block_fronts[block_id] = (front_color, front_letter)

        block_query = "INSERT INTO block(id, game_id, front_color, back_color, front_letter, back_letter) VALUES( " + n_values_str(6) + ")"
        block_values = (block_id,
                        game_id,
                        front_color,
                        block['flipColor'],
                        front_letter,
                        block['flipLetter'])
        cursor.execute(block_query, block_values)

    for action in game_data['actions']:
        action_type = action['type']
        if action_type == 'gesture':
            gesture_id = str(uuid.uuid4())
            gesture_query = "INSERT INTO gesture(id, game_id, game_time, x, y) VALUES(" + n_values_str(5) + ")"
            gesture_values = (gesture_id,
                              game_id,
                              action['time'],
                              action['left_pos'],
                              action['top_pos'])
            cursor.execute(gesture_query, gesture_values)
        elif action_type == 'command':
            command_id = str(uuid.uuid4())
            command_query = "INSERT INTO command(id, game_id, game_time, text) VALUES(" + n_values_str(4) + ")"
            command_values = (command_id,
                              game_id,
                              action['time'],
                              action['text'])
            cursor.execute(command_query, command_values)
        elif action_type == 'flip':
            block_id = action['id']
            flip_id = str(uuid.uuid4())
            flip_query = "INSERT INTO flip(id, game_id, game_time, block_id, front_facing, x, y) VALUES(" + n_values_str(7) + ")"
            flip_values = (flip_id,
                           game_id,
                           action['time'],
                           block_id,
                           block_fronts[block_id] == (action['color'], action['letter']),
                           action['left_pos'],
                           action['top_pos'])
            cursor.execute(flip_query, flip_values)
        elif action_type == 'movement':
            block_id = action['id']
            move_id = str(uuid.uuid4())
            move_query = "INSERT INTO move(id, game_id, game_time, block_id, front_facing, start_x, start_y, end_x, end_y) VALUES(" + n_values_str(9) + ")"
            move_values = (move_id,
                           game_id,
                           action['time'],
                           block_id,
                           block_fronts[block_id] == (action['color'], action['letter']),
                           action['left_pos'],
                           action['top_pos'],
                           action['new_left_pos'],
                           action['new_top_pos'])
            cursor.execute(move_query, move_values)


    db_connection.commit()


def store_survey(db_connection, survey_data):
    cursor = db_connection.cursor()
    cursor.execute("INSERT INTO survey(q1) values(%s)", (survey_data['q1'],))
    db_connection.commit()

def n_values_str(num_values):
    return "".join(["%s, " for _ in range(num_values - 1)] + ["%s"])
