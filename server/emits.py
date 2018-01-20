import threading

_starting_game_data = dict()
_voice_connection_data = dict()

def setup_initial_position(sio, rooms_tracker):
    lock = threading.Lock()

    def initial_position_handler(sid, data):
        room = rooms_tracker.get_room(sid)
        with lock:
            if room not in _starting_game_data:
                _starting_game_data[room] = data
            else:
                sio.emit('setInitialPosition', _starting_game_data[room], skip_sid=sid)
                sio.emit('unfreeze_start', room=room)

    sio.on('setInitialPosition', initial_position_handler)

def setup_echos(sio, rooms_tracker):
    def echo_event(event):
        def echo_handler(sid, data=None):
            sio.emit(event, data, rooms_tracker.get_room(sid))

        sio.on(event, echo_handler)

    echo_event('enable_blocks_for_player_2')
    echo_event('disable_blocks_for_player_2')
    echo_event('Update_score')

def setup_updates(sio, rooms_tracker):
    def update_on_receive(event):
        def update_handler(sid, data):
            sio.emit("update_" + event, data, rooms_tracker.get_room(sid))

        sio.on("receive_" + event, update_handler)

    update_on_receive('position')
    update_on_receive('flip_block')
    update_on_receive('movement_data')
    update_on_receive('gesture_data')
    update_on_receive('user_message')

def setup_audio(sio, rooms_tracker):
    def connection_handler(sid, data):
        room = rooms_tracker.get_room(sid)
        if room in _voice_connection_data:
            sio.emit('audio_connection', _voice_connection_data[room],
                     room, skip_sid=sid)
        else:
            _voice_connection_data[room] = data

    def reset_handler(sid):
        room = rooms_tracker.get_room(sid)
        _voice_connection_data.pop(room)
        sio.emit('alert_human_disconnect', room=room)

    sio.on('audio_connection', connection_handler)
    sio.on('reset_audio_id', reset_handler)

def setup_reconnected(sio, rooms_tracker):
    def human_reconnected_handler(sid):
        room = rooms_tracker.get_room(sid)
        sio.emit('alert_human_reconnected', _voice_connection_data[room], room)

    sio.on('human_reconnected', human_reconnected_handler)

def setup_ending(sio, rooms_tracker):
    _in_surveys = set()

    def end_button_handler(sid, data):
        room = rooms_tracker.get_room(sid)
        _in_surveys.add(room)
        sio.emit('end_game_for_user', data, room)

    def disconnect_handler(sid):
        room = rooms_tracker.get_room(sid)
        _starting_game_data.pop(room)
        if room not in _in_surveys:
            sio.emit('user_left_game', room=room)
            _in_surveys.remove(room)

        _starting_game_data.pop(room)
        _voice_connection_data.pop(room)

    sio.on('end_button_pressed', end_button_handler)
    sio.on('disconnect', disconnect_handler)
