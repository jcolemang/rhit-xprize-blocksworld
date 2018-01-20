class EchoEmitter:
    def __init__(self, sio, rooms_tracker):
        self.sio = sio
        self.rooms_tracker = rooms_tracker

    def setup_echos(self):
        self.echo_event('enable_blocks_for_player_2')
        self.echo_event('disable_blocks_for_player_2', True)
        self.echo_event('Update_score')

    def echo_event(self, event, ignore_data=False):
        def echo_handler(sid, data):
            if ignore_data:
                data = None

            self.sio.emit(event, data, self.rooms_tracker.get_room(sid))

        self.sio.on(event, echo_handler)

    def setup_updates(self):
        self.update_on_receive('position')
        self.update_on_receive('flip_block')
        self.update_on_receive('movement_data')
        self.update_on_receive('gesture_data')
        self.update_on_receive('user_message')

    def update_on_receive(self, event):
        def update_handler(sid, data):
            self.sio.emit("update_" + event, data, self.rooms_tracker.get_room(sid))

        self.sio.on("receive_" + event, update_handler)

    def setup_alerts(self):
        def human_reconnected_handler(sid, data):
            self.sio.emit('alert_human_reconnected', {})

        self.sio.on('human_reconnected')
