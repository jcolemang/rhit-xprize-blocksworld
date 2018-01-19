import socketio
import threading

class RoomsTracker:
    def __init__(self, sio_app):
        self.sio_app = sio_app
        self.recent_room = None
        self.next_room = 0
        self.room_map = {}
        self.lock = threading.Lock()

    def get_room(self, sid):
        return self.room_map[sid]

    def add_to_room(self, sid):
        with self.lock:
            if self.recent_room == None:
                self._add_to_new_room(sid)
            else:
                self._add_to_recent_room(sid)

    def _add_to_new_room(self, sid):
        room_name = self._make_room_name(self.next_room)
        self._enter_room(sid, room_name)
        self.recent_room = self.next_room
        self.next_room += 1

    def _add_to_recent_room(self, sid):
        room_name = self._make_room_name(self.recent_room)
        self._enter_room(sid, room_name)
        self.recent_room = None

    def _enter_room(self, sid, room_name):
        self.sio_app.enter_room(sid, room_name)
        self.room_map[sid] = room_name

    @staticmethod
    def _make_room_name(room_num):
        return "Room" + str(room_num)
