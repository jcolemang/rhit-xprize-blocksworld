import threading

import database as db
import neural_network_interface as nn

_starting_game_data = dict()
_voice_connection_data = dict()

def self_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid),
             rooms_tracker.get_roommate(sid))

def room_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid))

def setup_initial_position(sio, rooms_tracker):
    lock = threading.Lock()

    def initial_position_handler(sid, data):
        with lock:
            rooms_tracker.add_to_singles_room(sid)
            room = rooms_tracker.get_room(sid)

            _starting_game_data[room] = data
            self_emit(sio, sid, 'freeze_start', rooms_tracker)
            self_emit(sio, sid, 'unfreeze_start', rooms_tracker)

    sio.on('setInitialPosition', initial_position_handler)

# Different effects for Co-Op and AI modes
def setup_varied_updates(sio, rooms_tracker):
    gesture = {}
    model = nn.NeuralNetworkBlocksworldModel({
        'flips': 'flips.h5',
        'colors': 'colors.h5',
        'letters': 'letters.h5'
    })

    def gesture_handler(sid, data):
        gesture[sid] = data

    def user_message_handler(sid, data):
        move = model.generate_move(
            sid,
            gesture[sid],
            data
        )
        gesture[sid] = None

        if not move:
            print("Failed to find the requested block.")
            return

        # Messages to be cleaned up with issue #25
        if move['type'] == 'flip':
            # Transmit id as 'block<id>'
            self_emit(sio, sid, 'update_flip_block',
                      rooms_tracker, move['block_id'][1:])
        elif move['type'] == 'impossible':
            self_emit(sio, sid, 'indicate_impossible_move',
                      rooms_tracker, move)
        elif move['type'] == 'ambiguous':
            self_emit(sio, sid, 'indicate_ambiguous_move',
                      rooms_tracker, move)
        else:
            # Transmit id as 'block<id>'
            move_data = {
                'top': move['top'],
                'left': move['left'],
                'block_id': move['block_id'][1:]
            }

            self_emit(sio, sid, 'update_position',
                      rooms_tracker, move_data)
            self_emit(sio, sid, 'update_movement_data',
                      rooms_tracker, move['move_number'])
            # Transmit id as 'block<id>'
            self_emit(sio, sid, 'Update_score',
                      rooms_tracker, move_data)

    sio.on('receive_gesture_data', gesture_handler)
    sio.on('receive_user_message', user_message_handler)

def setup_ending(sio, rooms_tracker, config):
    db_connection = db.connect_to_db(config)
    _in_surveys = set()

    def end_button_handler(sid, data):
        room = rooms_tracker.get_room(sid)
        _in_surveys.add(room)
        db.store_game(db_connection, data)

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

    def store_survey_handler(_, data):
        db.store_survey(db_connection, data)

    sio.on('end_button_pressed', end_button_handler)
    sio.on('disconnect', disconnect_handler)
    sio.on('send_survey_data_to_server', store_survey_handler)
