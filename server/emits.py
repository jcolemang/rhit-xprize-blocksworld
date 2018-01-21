import threading

import database as db

_starting_game_data = dict()
_voice_connection_data = dict()

def self_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid),
             rooms_tracker.get_roommate(sid))

def roommate_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid), skip_sid=sid)

def room_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid))

def setup_initial_position(sio, rooms_tracker):
    lock = threading.Lock()

    def initial_position_handler(sid, data):
        room = rooms_tracker.get_room(sid)
        with lock:
            if room not in _starting_game_data:
                _starting_game_data[room] = data
            else:
                self_emit(sio, sid, 'setInitialPosition',
                          rooms_tracker, _starting_game_data[room])
                roommate_emit(sio, sid, 'unfreeze_start', rooms_tracker)

    sio.on('setInitialPosition', initial_position_handler)

def setup_echos(sio, rooms_tracker):
    def echo_event(event):
        def echo_handler(sid, data=None):
            roommate_emit(sio, sid, event, rooms_tracker, data)

        sio.on(event, echo_handler)

    echo_event('enable_blocks_for_player_2')
    echo_event('disable_blocks_for_player_2')
    echo_event('Update_score')

def setup_updates(sio, rooms_tracker):
    def update_on_receive(event):
        def update_handler(sid, data=None):
            roommate_emit(sio, sid, "update_" + event, rooms_tracker, data)

        sio.on("receive_" + event, update_handler)

    update_on_receive('position')
    update_on_receive('flip_block')
    update_on_receive('movement_data')
    update_on_receive('gesture_data')

    def user_message_handler(sid, data):
        room_emit(sio, sid, 'update_user_message', rooms_tracker, data)

    sio.on('receive_user_message', user_message_handler)

def setup_reconnected(sio, rooms_tracker):
    def human_reconnected_handler(sid):
        room = rooms_tracker.get_room(sid)
        roommate_emit(sio, sid, 'alert_human_reconnected', rooms_tracker,
                      _voice_connection_data[room])

    sio.on('human_reconnected', human_reconnected_handler)

def setup_ending(sio, rooms_tracker):
    _in_surveys = set()

    def end_button_handler(sid, data):
        room = rooms_tracker.get_room(sid)
        _in_surveys.add(room)
        roommate_emit(sio, sid, 'end_game_for_user', rooms_tracker, data)

    def disconnect_handler(sid):
        room = rooms_tracker.get_room(sid)
        if room in _starting_game_data:
            _starting_game_data.pop(room)

        if room not in _in_surveys:
            room_emit(sio, sid, 'user_left_game', rooms_tracker)
        else:
            _in_surveys.remove(room)

        if room in _starting_game_data:
            _starting_game_data.pop(room)
        if room in _voice_connection_data:
            _voice_connection_data.pop(room)

    sio.on('end_button_pressed', end_button_handler)
    sio.on('disconnect', disconnect_handler)

def setup_database(sio, config):
    db_cursor = db.connect_to_db(config)

    def store_game_handler(_, data):
        db.store_game(db_cursor, data)

    sio.on('send_data_to_server', store_game_handler)
