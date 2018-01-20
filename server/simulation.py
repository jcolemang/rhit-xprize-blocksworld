import sys
import socketio
import tornado.web
import eventlet

import config as cfg
from rooms import RoomsTracker
from echo_emitter import EchoEmitter

sio = socketio.Server()
rooms_tracker = RoomsTracker(sio)

def main():
    config = cfg.generate_config(get_is_local())
    echo_emitter = EchoEmitter(sio, rooms_tracker)
    setup_emits(echo_emitter)
    start_app(config)

def get_is_local():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

def setup_emits(echo_emitter):
    echo_emitter.setup_echos()
    echo_emitter.setup_updates()

def start_app(config):
    app = tornado.web.Application()
    socketApp = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', config['serverPort'])), socketApp)

@sio.on('connect')
def connection_handler(sid, _):
    print("Connected to client")
    rooms_tracker.add_to_room(sid)
    sio.emit('freeze_start')

if __name__ == '__main__':
    main()
