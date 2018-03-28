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
        if sid not in self.room_map:
            return None

        return self.room_map[sid]

    def add_to_singles_room(self, sid):
        with self.lock:
            room = self._create_room()
            self._enter_room(sid, room)

    def _enter_room(self, sid, room_name):
        self.sio_app.enter_room(sid, room_name)
        self.room_map[sid] = room_name

    def _create_room(self):
        name = "Room" + str(self.next_room)
        self.next_room += 1
        return name
