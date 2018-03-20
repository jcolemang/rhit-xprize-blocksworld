import threading

import database as db
import neural_network_interface as nn

_starting_game_data = dict()
_voice_connection_data = dict()

def self_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid),
             rooms_tracker.get_roommate(sid))

def roommate_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid), skip_sid=sid)

def room_emit(sio, sid, event, rooms_tracker, data=None):
    sio.emit(event, data, rooms_tracker.get_room(sid))

def is_coop(data):
    return data and (data['gameType'] == 'human')

def setup_initial_position(sio, rooms_tracker):
    lock = threading.Lock()

    def initial_position_handler(sid, data):
        def ai_opponent_setup():
            rooms_tracker.add_to_singles_room(sid)
            room = rooms_tracker.get_room(sid)

            _starting_game_data[room] = data
            self_emit(sio, sid, 'freeze_start', rooms_tracker)
            self_emit(sio, sid, 'unfreeze_start', rooms_tracker)

        def human_opponent_setup():
            rooms_tracker.add_to_coop_room(sid)
            room = rooms_tracker.get_room(sid)

            if room not in _starting_game_data:
                _starting_game_data[room] = data
                self_emit(sio, sid, 'freeze_start', rooms_tracker)
            else:
                self_emit(sio, sid, 'setInitialPosition',
                          rooms_tracker, _starting_game_data[room])
                roommate_emit(sio, sid, 'unfreeze_start', rooms_tracker)

        with lock:
            if is_coop(data):
                human_opponent_setup()
            else:
                ai_opponent_setup()

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

# Different effects for Co-Op and AI modes
def setup_varied_updates(sio, rooms_tracker):
    gesture = {}
    model = nn.NeuralNetworkBlocksworldModel({
        'flips': 'flips.h5',
        'colors': 'colors.h5',
        'letters': 'letters.h5'
    })

    def gesture_handler(sid, data):
        if is_coop(data):
            roommate_emit(sio, sid, 'update_gesture_data', rooms_tracker, data)
        else:
            gesture[sid] = data

    def user_message_handler(sid, data):
        if is_coop(data):
            room_emit(sio, sid, 'update_user_message', rooms_tracker, data)
        else:
            move = model.generate_move(
                sid,
                gesture[sid],
                data
            )
            gesture[sid] = None
            print("Received move: " + str(move))
            if not move:
                print("Failed to find the requested block.")
                return

            # Messages to be cleaned up with issue #25
            if move['type'] == 'flip':
                # Transmit id as 'block<id>'
                self_emit(sio, sid, 'update_flip_block',
                          rooms_tracker, move['block_id'][1:])
            else:
                # Transmit id as 'block<id>'
                self_emit(sio, sid, 'update_position',
                          rooms_tracker, {
                              'top': move['top'],
                              'left': move['left'],
                              'block_id': move['block_id'][1:]
                          })
                self_emit(sio, sid, 'update_movement_data',
                          rooms_tracker, move['move_number'])
                # Transmit id as the integer <id>
                self_emit(sio, sid, 'Update_score',
                          rooms_tracker, {
                              'id': int(move['block_id'][6:]),
                              'tTop': move['top'],
                              'tLeft': move['left']
                          })

    sio.on('receive_gesture_data', gesture_handler)
    sio.on('receive_user_message', user_message_handler)

def setup_reconnected(sio, rooms_tracker):
    def human_reconnected_handler(sid):
        room = rooms_tracker.get_room(sid)
        roommate_emit(sio, sid, 'alert_human_reconnected', rooms_tracker,
                      _voice_connection_data[room])

    sio.on('human_reconnected', human_reconnected_handler)

def setup_ending(sio, rooms_tracker, config):
    db_connection = db.connect_to_db(config)
    _in_surveys = set()

    def end_button_handler(sid, data):
        room = rooms_tracker.get_room(sid)
        _in_surveys.add(room)
        print("Received records: " + str(data))
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
