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
    values_str = "".join(["%s, " for _ in range(16)] + ["%s"]) # "%s, %s, %s, ... %s"
    query_str = "INSERT INTO ibmdb(" + columns_str + ") values(" + values_str + ")"

    values_tuple = (game_data['time'], game_data['task'], game_data['b'], game_data['W'],
                    game_data['G'], game_data['bm'], game_data['br'], game_data['pn'],
                    game_data['pp'], game_data['te'], game_data['ie'], game_data['p'],
                    game_data['Action'], game_data['initialInfo'], game_data['other'],
                    game_data['finalScore'], game_data['standard_info'])

    cursor.execute(query_str, values_tuple)
    db_connection.commit()
