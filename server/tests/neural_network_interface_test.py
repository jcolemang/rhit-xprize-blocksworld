
import neural_network_interface as nni

def construct_block(blockId,
                    topColor,
                    topLetter,
                    bottomColor,
                    bottomLetter):
    return {
        'blockId': blockId,
        'topColor': topColor,
        'bottomColor': bottomColor,
        'topLetter': topLetter,
        'bottomLetter': bottomLetter
    }   

def test_find_block_incorrect_color_no_letters():
    color = 'green'
    letter = 'x'
    game_state = [
        construct_block('#block1', 'red', 'a', 'blue', 'b'),
        construct_block('#block2', 'purple', 'a', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert result == []
    
def test_find_block_incorrect_color_no_letters():
    color = 'green'
    letter = 'z'
    game_state = [
        construct_block('#block1', 'red', 'a', 'green', 'b'),
        construct_block('#block2', 'beije', 'a', 'yellow', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert result == []

def test_find_block_incorrect_colors_one_correct_letter():
    color = 'green'
    letter = 'b'
    game_state = [
        construct_block('#block1', 'red', 'a', 'blue', 'b'),
        construct_block('#block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert result == []

def test_find_block_one_correct_color_incorrect_letter():
    color = 'red'
    letter = 'y'
    game_state = [
        construct_block('block1', 'red', 'a', 'blue', 'b'),
        construct_block('block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert result == []

def test_find_block_one_correct_color_no_letter():
    color = 'red'
    letter = 'none'
    game_state = [
        construct_block('block1', 'red', 'a', 'blue', 'b'),
        construct_block('block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert result == ['block1']

def test_find_block_color_one_correct_letter():
    color = 'none'
    letter = 'b'
    game_state = [
        construct_block('block1', 'red', 'a', 'blue', 'b'),
        construct_block('block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert result == ['block2']
