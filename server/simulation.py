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
    start_app(config)

def get_is_local():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

def setup_echos():
    echo_event('enable_blocks_for_player_2')
    echo_event('disable_blocks_for_player_2')
    echo_event('Update_score')

def start_app(config):
    app = tornado.web.Application()
    socketApp = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', config['serverPort'])), socketApp)

@sio.on('connect')
def connection_handler(sid, _):
    print("Connected to client")
    rooms_tracker.add_to_room(sid)
    sio.emit('freeze_start')

def echo_event(event):
    def echo_handler(sid, _):
        sio.emit(event, room=rooms_tracker.get_room(sid))

    sio.on(event, echo_handler)

if __name__ == '__main__':
    main()
