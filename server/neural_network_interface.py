from keras.models import load_model
import numpy as np
from itertools import chain
import sys

from rhit_xprize_neural_network import model_runner as runner
from rhit_xprize_neural_network import trainer_core as core

class BlocksworldModel(object):
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
    def __init__(self, h5_paths, ambiguity_threshold=0.3):
        super().__init__()
        self.ambiguity_threshold = ambiguity_threshold
        (self.flip_model, self.colors_model, self.letters_model) = runner.load_models(h5_paths)
        self.tokenizer = core.build_tokenizer(core.load_vocabulary())

    def generate_move(self, sid, gesture_data, message_data):
        movement_ct = self._movement_count_dict.setdefault(sid, 0) + 1
        self._movement_count_dict[sid] = movement_ct

        message = message_data['text']
        game_state = message_data['gameState']

        (flip_tup, color_tup, letter_tup) = self._run_models(message)

        ambig_letter = letter_tup if letter_tup[1] > self.ambiguity_threshold else ('None', 1)
        ambig_color = color_tup if color_tup[1] > self.ambiguity_threshold else ('None', 1)
        candidates = _find_block(game_state, ambig_color[0], ambig_letter[0])

        if len(candidates) == 0:
            return self._build_impossible(letter_tup[0], color_tup[0])
        if len(candidates) > 1:
            return self._build_ambiguous(flip_tup[0],
                                         letter_tup[0],
                                         color_tup[0],
                                         candidates,
                                         gesture_data,
                                         sid)

        block_id = candidates[0]
        if flip_tup[0] == 'Flip':
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

    def _build_ambiguous(self, action, letter, color, block_candidates, gesture_data, sid):
        return {
            'type': 'ambiguous_flip' if action == 'Flip' else 'ambiguous_move',
            'predicted_letter': letter if letter != 'None' else False,
            'predicted_color': color if color != 'None' else False,
            'candidates': block_candidates,
            'top': gesture_data['top'],
            'left': gesture_data['left'],
            'move_number': self._movement_count_dict[sid]
        }

    def _build_impossible(self, letter, color):
        return {
            'type': 'impossible',
            'predicted_letter': letter if letter != 'None' else False,
            'predicted_color': color if color != 'None' else False
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

    if color.upper() == 'NONE' and letter.upper() == 'NONE':
        return list(map(lambda x: x['id'], game_state))

    for block in game_state:
        # Note that each of these could be 'None', but this is ignored
        # and that list will be empty.
        if block['topColor'].upper() == color.upper():
            correct_color.append(block['id'])
        if block['topLetter'].upper() == letter.upper():
            correct_letter.append(block['id'])

    if color.upper() == 'NONE':
        return correct_letter
    elif letter.upper() == 'NONE':
        return correct_color

    intersection = list(set(correct_color).intersection(correct_letter))
    return intersection
