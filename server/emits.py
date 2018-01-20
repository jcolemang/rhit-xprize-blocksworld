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

def setup_ending(sio, room_tracker):
    in_surveys = set()

    def setup_end_button():
        def end_button_handler(sid, _):
            in_surveys.add(room_tracker.get_room(sid))

        sio.on('end_button_pressed', end_button_handler)

    def setup_disconnect():
        def disconnect_handler(sid, _):
            room = room_tracker.get_room(sid)
            if room not in in_surveys:
                sio.emit('user_left_game', room)
                in_surveys.remove(room)

        sio.on('disconnect', disconnect_handler)

    setup_end_button()
    setup_disconnect()
