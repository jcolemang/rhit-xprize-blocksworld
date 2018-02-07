from keras.models import load_model

_movement_count_dict = {}

class BlocksworldModel:
    def __init__(self):
        pass

    def generate_move(sid, gesture_data, message_data):
        """Returns the (position data, movement count) that will be sent to the
        client.

        """
        raise NotImplementedError('Subclasses must implement generate_move')


class DumbBlocksworldModel(BlocksworldModel):
    def generate_move(sid, gesture_data, message_data):
        movement_ct = _movement_count_dict.setdefault(sid, 0) + 1
        _movement_count_dict[sid] = movement_ct

        if gesture_data is None:
            gesture_data = {'top': 0,
                            'left': 0}

        return ({'top': gesture_data['top'],
                 'left': gesture_data['left'],
                 'block_id': 'block3'},
                movement_ct)

class NeuralNetworkBlocksworldModel(BlocksworldModel):
    def __init__(self, h5_path):
        self.model = load_model(h5_path)
        
