import sys
import socketio
import tornado.web
import eventlet

import config as cfg

sio = socketio.Server()

def main():
    config = cfg.generate_config(get_is_local())
    app = tornado.web.Application()
    socketApp = socketio.Middleware(sio, app)
    eventlet.wsgi.server(eventlet.listen(('', config['serverPort'])), socketApp)

@sio.on('connect')
def connection_handler(sid, msg):
    print("Connected to client")
    sio.enter_room(sid, 'Room0')
    sio.emit('freeze_start')

def get_is_local():
    args = sys.argv[1:]
    return len(args) == 0 or args[0] == 'local'

if __name__ == '__main__':
    main()
