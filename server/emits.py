import threading

_starting_game_data = dict()

def setup_initial_position(sio, rooms_tracker):
    lock = threading.Lock()

    def initial_position_handler(sid, data):
        room = rooms_tracker.get_room(sid)
        with lock:
            if room not in _starting_game_data:
                _starting_game_data[room] = data
            else:
                sio.emit('setInitialPosition', _starting_game_data[room], room)
                sio.emit('unfreeze_start', room)

    sio.on('setInitialPosition', initial_position_handler)

def setup_echos(sio, rooms_tracker):
    def echo_event(event, ignore_data=False):
        def echo_handler(sid, data):
            if ignore_data:
                data = None

            sio.emit(event, data, rooms_tracker.get_room(sid))

        sio.on(event, echo_handler)

    echo_event('enable_blocks_for_player_2')
    echo_event('disable_blocks_for_player_2', True)
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

def setup_reconnected(sio):
    def human_reconnected_handler(sid, data):
        sio.emit('alert_human_reconnected', {})

    sio.on('human_reconnected')

def setup_ending(sio, rooms_tracker):
    _in_surveys = set()

    def setup_end_button():
        def end_button_handler(sid, _):
            _in_surveys.add(rooms_tracker.get_room(sid))

        sio.on('end_button_pressed', end_button_handler)

    def setup_disconnect():
        def disconnect_handler(sid, _):
            room = rooms_tracker.get_room(sid)
            _starting_game_data.pop(room)
            if room not in _in_surveys:
                sio.emit('user_left_game', room)
                _in_surveys.remove(room)

        sio.on('disconnect', disconnect_handler)

    setup_end_button()
    setup_disconnect()
