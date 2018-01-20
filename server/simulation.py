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
    setup_emits()
    start_app(config)

def get_is_local():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

def setup_emits():
    emits.setup_initial_position(sio, rooms_tracker)
    emits.setup_echos(sio, rooms_tracker)
    emits.setup_updates(sio, rooms_tracker)
    emits.setup_audio(sio, rooms_tracker)
    emits.setup_reconnected(sio, rooms_tracker)
    emits.setup_ending(sio, rooms_tracker)

def start_app(config):
    app = tornado.web.Application()
    socketApp = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', config['serverPort'])), socketApp)

@sio.on('connect')
def connection_handler(sid, _):
    if rooms_tracker.add_to_room(sid):
        sio.emit('freeze_start',
                 room=rooms_tracker.get_room(sid),
                 skip_sid=rooms_tracker.get_roommate(sid))

if __name__ == '__main__':
    main()
