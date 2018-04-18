import neural_network_interface as nni

def construct_block(blockId,
                    topColor,
                    topLetter,
                    bottomColor,
                    bottomLetter):
    return {
        'id': blockId,
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
    assert set(result) == set([])

def test_find_block_incorrect_colors_one_correct_letter():
    color = 'green'
    letter = 'b'
    game_state = [
        construct_block('#block1', 'red', 'a', 'blue', 'b'),
        construct_block('#block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert set(result) == set([])

def test_find_block_one_correct_color_incorrect_letter():
    color = 'red'
    letter = 'y'
    game_state = [
        construct_block('block1', 'red', 'a', 'blue', 'b'),
        construct_block('block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert set(result) == set([])

def test_find_block_one_correct_color_no_letter():
    color = 'red'
    letter = 'none'
    game_state = [
        construct_block('block1', 'red', 'a', 'blue', 'b'),
        construct_block('block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert set(result) == set(['block1'])

def test_find_block_color_one_correct_letter():
    color = 'none'
    letter = 'b'
    game_state = [
        construct_block('block1', 'red', 'a', 'blue', 'b'),
        construct_block('block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert set(result) == set(['block2'])

def test_find_block_color_and_letter_none():
    color = 'none'
    letter = 'none'
    game_state = [
        construct_block('block1', 'red', 'a', 'blue', 'b'),
        construct_block('block2', 'purple', 'b', 'blue', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert set(result) == set(['block1', 'block2'])

def test_find_block_multiple_accurate():
    color = 'baydj'
    letter = 'b'
    game_state = [
        construct_block('block1', 'purple', 'c', 'red', 'b'),
        construct_block('block2', 'baydj', 'b', 'blue', 'b'),
        construct_block('block3', 'baydj', 'b', 'green', 'c')
    ]

    result = nni._find_block(game_state, color, letter)
    assert set(result) == set(['block2', 'block3'])
