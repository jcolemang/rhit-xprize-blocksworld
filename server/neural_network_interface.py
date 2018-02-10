from keras.models import load_model
import numpy as np
from itertools import chain

_movement_count_dict = {}

"""
~~~~~ This code was copied and pasted from the neural net repo. It should
      be factored out in both places. ~~~~~
"""

def color_cat(s):
    if s.lower() == 'green':
        return 1
    elif s.lower() == 'blue':
        return 2
    elif s.lower() == 'red':
        return 3
    elif s.lower() == 'yellow':
        return 4
    elif s.lower() == 'orange':
        return 4
    raise RuntimeError('Unrecognized color:', s)

def encode_states(states):
    for curr_state in states:
        for block_offset in range(0, len(curr_state), 7):
            curr_state[block_offset + 1] = \
                ord(curr_state[block_offset + 1]) - ord('A') + 1
            curr_state[block_offset + 3] = \
                ord(curr_state[block_offset + 3]) - ord('A') + 1
            curr_state[block_offset + 2] = \
                color_cat(curr_state[block_offset + 2])
            curr_state[block_offset + 4] = \
                color_cat(curr_state[block_offset + 4])

    return states

def tokenize_string(s):
    MAX_LEN = 50
    SYMBOLS = np.asarray(list('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,1234567890'))
    TOKENS = dict((c, i) for i, c in enumerate(SYMBOLS))
    N_SYMBOLS = len(SYMBOLS)
    ret = np.zeros((MAX_LEN, N_SYMBOLS), dtype=bool)
    for i, char in enumerate(s):
        ret[i, TOKENS[char]] = 1
    return ret

def tokenize(a):
    return np.array(list(map(lambda s: tokenize_string(s), list(a))))

"""
~~~~~ End copied and pasted code. ~~~~~
"""

class BlocksworldModel:
    def __init__(self):
        pass

    def generate_move(self, sid, gesture_data, message_data):
        """
        Returns the (position data, movement count) that will be sent to the
        client.
        """
        raise NotImplementedError('Subclasses must implement generate_move')


class DumbBlocksworldModel(BlocksworldModel):
    def generate_move(self, sid, gesture_data, message_data):
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

    def convert_state(self, input_state):
        def convert_block(block):
            return [
                block['blockId'][6:],
                block['topLetter'],
                block['topColor'],
                block['bottomLetter'],
                block['bottomColor'],
                0,
                0
            ]
        block_lists = chain.from_iterable(map(convert_block, input_state))
        return np.array([list(block_lists)])


    def generate_move(self, sid, gesture_data, message_data):
        movement_ct = _movement_count_dict.setdefault(sid, 0) + 1
        message = message_data['text']
        game_state = message_data['gameState']

        state_input = encode_states(self.convert_state(game_state))
        words_input = tokenize(message)

        prediction = self.model.predict({
            'state_input': state_input,
            'words_input': words_input
        })

        to_move = np.argmax(prediction[0])
        move = {
            'top': gesture_data['top'],
            'left': gesture_data['left'],
            'block_id': 'block' + str(to_move)
        }

        return (move, movement_ct)
