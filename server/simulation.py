import sys
import socketio
import tornado.web
import eventlet

import config as cfg
from rooms import RoomsTracker
import emits

sio = socketio.Server()
rooms_tracker = RoomsTracker(sio)

def main():
    config = cfg.generate_config(get_is_local())
    setup_emits(config)
    start_app(config)

def get_is_local():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

def setup_emits(config):
    emits.setup_initial_position(sio, rooms_tracker)
    emits.setup_echos(sio, rooms_tracker)
    emits.setup_updates(sio, rooms_tracker)
    emits.setup_varied_updates(sio, rooms_tracker)
    emits.setup_reconnected(sio, rooms_tracker)
    emits.setup_ending(sio, rooms_tracker, config)

def start_app(config):
    app = tornado.web.Application()
    socketApp = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', config['serverPort'])), socketApp)

if __name__ == '__main__':
    main()
