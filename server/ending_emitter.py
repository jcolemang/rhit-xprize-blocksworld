def setup_ending_emits(sio, room_tracker):
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
