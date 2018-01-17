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
    app = tornado.web.Application()
    socketApp = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', config['serverPort'])), socketApp)

@sio.on('connect')
def connection_handler(sid, msg):
    print("Connected to client")
    rooms_tracker.add_to_room(sid)
    sio.emit('freeze_start')

def get_is_local():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

if __name__ == '__main__':
    main()
