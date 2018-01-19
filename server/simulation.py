import sys
import socketio
import tornado.web
import eventlet

import config as cfg
from rooms import RoomsTracker

sio = socketio.Server()
rooms_tracker = RoomsTracker(sio)

def main():
    config = cfg.generate_config(get_is_local())
    setup_echos()
    setup_updates()
    start_app(config)

def get_is_local():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

def setup_echos():
    echo_event('enable_blocks_for_player_2')
    echo_event('disable_blocks_for_player_2', True)
    echo_event('Update_score')

def setup_updates():
    update_on_receive('position')
    update_on_receive('flip_block')
    update_on_receive('movement_data')
    update_on_receive('gesture_data')
    update_on_receive('user_message')

def start_app(config):
    app = tornado.web.Application()
    socketApp = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', config['serverPort'])), socketApp)

@sio.on('connect')
def connection_handler(sid, _):
    print("Connected to client")
    rooms_tracker.add_to_room(sid)
    sio.emit('freeze_start')

def echo_event(event, ignore_data=False):
    def echo_handler(sid, data):
        if ignore_data:
            data = None

        sio.emit(event, data, rooms_tracker.get_room(sid))

    sio.on(event, echo_handler)

def update_on_receive(event):
    def update_handler(sid, data):
        sio.emit("update_" + event, data, rooms_tracker.get_room(sid))

    sio.on("receive_" + event, update_handler)

if __name__ == '__main__':
    main()
