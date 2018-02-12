from keras.models import load_model
import numpy as np
from itertools import chain
import sys

sys.path.append('../rhit-xprize-neural-network')

import model_runner as runner
import trainer_core as core

class BlocksworldModel:
    def __init__(self):
        self._movement_count_dict = {}

    def generate_move(self, sid, gesture_data, message_data):
        """
        Returns the (position data, movement count) that will be sent to the
        client.
        """
        raise NotImplementedError('Subclasses must implement generate_move')

class DumbBlocksworldModel(BlocksworldModel):
    def generate_move(self, sid, gesture_data, message_data):
        movement_ct = self._movement_count_dict.setdefault(sid, 0) + 1
        self._movement_count_dict[sid] = movement_ct

        if gesture_data is None:
            gesture_data = {'top': 0,
                            'left': 0}

        return ({'top': gesture_data['top'],
                 'left': gesture_data['left'],
                 'block_id': 'block3'},
                movement_ct)

class NeuralNetworkBlocksworldModel(BlocksworldModel):
    def __init__(self, h5_paths):
        (self.flip_model, self.colors_model, self.letters_model) = runner.load_models(h5_paths)
        self.tokenizer = core.build_tokenizer(core.load_vocabulary())
        super().__init__()

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
        movement_ct = self._movement_count_dict.setdefault(sid, 0) + 1
        self._movement_count_dict[sid] = movement_ct

        message = message_data['text']
        game_state = message_data['gameState']

        (flip, color, letter) = self._run_models(message)

        block_id = _find_block(game_state, color, letter)

        if not block_id:
            print(str(flip))
            print(str(color))
            print(str(letter))
            return None
        elif flip[0] == 'Flip':
            return self._build_flip(sid, block_id)
        else:
            return self._build_move(sid, gesture_data, block_id)

    def _run_models(self, text):
        flip = runner.run_model(self.flip_model, text, self.tokenizer)
        flip = runner.translate_flip(flip)

        color = runner.run_model(self.colors_model, text, self.tokenizer)
        color = runner.translate_colors(color)

        letter = runner.run_model(self.letters_model, text, self.tokenizer)
        letter = runner.translate_letters(letter)

        return (flip, color, letter)

    def _build_flip(self, sid, block_id):
        return {
            'type': 'flip',
            'block_id': block_id,
            'move_number': self._movement_count_dict[sid]
        }

    def _build_move(self, sid, gesture_data, block_id):
        return {
            'type': 'move',
            'block_id': block_id,
            'top': gesture_data['top'],
            'left': gesture_data['left'],
            'move_number': self._movement_count_dict[sid]
        }

def _find_block(game_state, color, letter):
    correct_color = []
    correct_letter = []

    for block in game_state:
        # Note that each of these could be 'None', but this is ignored
        # and that list will be empty.
        if block['topColor'].upper() == color[0].upper():
            correct_color += [block['blockId']]
        if block['topLetter'].upper() == letter[0].upper():
            correct_letter += [block['blockId']]

    if len(correct_color) == 0 and len(correct_letter) == 0:
        return None

    if len(correct_color) == 0:
        return correct_letter[0]

    if len(correct_letter) == 0:
        return correct_color[0]

    intersection = list(set(correct_color).intersection(correct_letter))

    if len(intersection) > 0:
        return intersection[0]

    return correct_color[0]
