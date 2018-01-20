def setup_echo_emits(sio, rooms_tracker):
    def echo_event(event, ignore_data=False):
        def echo_handler(sid, data):
            if ignore_data:
                data = None

            sio.emit(event, data, rooms_tracker.get_room(sid))

        sio.on(event, echo_handler)

    echo_event('enable_blocks_for_player_2')
    echo_event('disable_blocks_for_player_2', True)
    echo_event('Update_score')

def setup_update_emits(sio, rooms_tracker):
    update_on_receive('position')
    update_on_receive('flip_block')
    update_on_receive('movement_data')
    update_on_receive('gesture_data')
    update_on_receive('user_message')

    def update_on_receive(event):
        def update_handler(sid, data):
            sio.emit("update_" + event, data, rooms_tracker.get_room(sid))

        sio.on("receive_" + event, update_handler)

def setup_reconnected(sio):
    def human_reconnected_handler(sid, data):
        sio.emit('alert_human_reconnected', {})

    sio.on('human_reconnected')
