import psycopg2 as pg

def connect_to_db(config):
    connection = pg.connect(dbname=config['dbName'],
                            user=config['dbUser'],
                            host=config['dbHost'],
                            port=config['dbPort'])
    return connection

def store_game(db_connection, game_data):
    cursor = db_connection.cursor()

    columns_str = ("Time, Task, b, W, G, bm, br, pn, pp, te, ie, p, " +
                   "TimeAndLocation, InitialInfo, SearchWords, finalScore, standard_info")
    values_str =  n_values_str(17)
    query_str = "INSERT INTO ibmdb(" + columns_str + ") values(" + values_str + ")"

    values_tuple = (game_data['time'], game_data['task'], game_data['b'], game_data['W'],
                    game_data['G'], game_data['bm'], game_data['br'], game_data['pn'],
                    game_data['pp'], game_data['te'], game_data['ie'], game_data['p'],
                    game_data['Action'], game_data['initialInfo'], game_data['other'],
                    game_data['finalScore'], game_data['standard_info'])

    cursor.execute(query_str, values_tuple)
    db_connection.commit()

def store_survey(db_connection, survey_data):
    cursor = db_connection.cursor()

    table_str = None
    columns_str = None
    values_str = None
    values_tuple = None

    if 'q4' in survey_data:
        table_str = 'human_survey'
        columns_str = 'q1, q2, q3, q4, q5, q6'
        values_str = n_values_str(6)
        values_tuple = (survey_data['q1'], survey_data['q2'], survey_data['q3'],
                        survey_data['q4'], survey_data['q5'], survey_data['q6'])
    else:
        table_str = 'robot_survey'
        columns_str = 'q1, q2, q3'
        values_str = n_values_str(3)
        values_tuple = (survey_data['q1'], survey_data['q2'], survey_data['q3'])

    query_str = "INSERT INTO {0}({1}) values({2})".format(table_str, columns_str, values_str)

    cursor.execute(query_str, values_tuple)
    db_connection.commit()

def n_values_str(num_values):
    return "".join(["%s, " for _ in range(num_values - 1)] + ["%s"])
