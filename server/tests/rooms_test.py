from rooms import RoomsTracker
import threading

class MockSIOApp:
    def __init__(self):
        self.enter_room_calls = {}

    def enter_room(self, _, room_name):
        if not room_name in self.enter_room_calls:
            self.enter_room_calls[room_name] = 0

        self.enter_room_calls[room_name] += 1

class TestSinglesRoomsTracker:
    def setup_method(self):
        self.sio_app = MockSIOApp()
        self.rooms_tracker = RoomsTracker(self.sio_app)

    def test_single_add_to_room(self):
        self.rooms_tracker.add_to_singles_room(123)

        assert self.sio_app.enter_room_calls == {"Room0": 1}

    def test_two_add_to_room(self):
        self.rooms_tracker.add_to_singles_room(123)
        self.rooms_tracker.add_to_singles_room(5)

        assert self.sio_app.enter_room_calls == {"Room0": 1, "Room1": 1}

class TestGetRoomAndRoommates:
    def setup_method(self):
        self.sio_app = MockSIOApp()
        self.rooms_tracker = RoomsTracker(self.sio_app)

    def test_get_existing_singles_room(self):
        self.rooms_tracker.add_to_singles_room(123)
        self.rooms_tracker.add_to_singles_room(5)
        self.rooms_tracker.add_to_singles_room(12)

        assert self.rooms_tracker.get_room(123) == "Room0"
        assert self.rooms_tracker.get_room(5) == "Room1"
        assert self.rooms_tracker.get_room(12) == "Room2"

class TestAsyncAdds:
    def setup_method(self):
        self.sio_app = MockSIOApp()
        self.rooms_tracker = RoomsTracker(self.sio_app)

    def test_stress_additions(self):
        class RoomAdder(threading.Thread):
            def __init__(self, count, seed, room_tracker):
                self.count = count
                self.seed = seed
                self.room_tracker = room_tracker
                super(RoomAdder, self).__init__()

            def run(self):
                for i in range(0, self.count):
                    self.room_tracker.add_to_singles_room(i + self.seed)

        t1 = RoomAdder(10, 0, self.rooms_tracker)
        t2 = RoomAdder(10, 10, self.rooms_tracker)
        t3 = RoomAdder(10, 20, self.rooms_tracker)
        t4 = RoomAdder(10, 30, self.rooms_tracker)

        t1.start()
        t2.start()
        t3.start()
        t4.start()

        t1.join()
        t2.join()
        t3.join()
        t4.join()

        rooms = 0
        for _, value in self.sio_app.enter_room_calls.items():
            assert value == 1
            rooms += 1

        assert rooms == 40
