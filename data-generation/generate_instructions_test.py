import generate_instructions as gi

def test_block_inequality_with_generated_ids():
    assert gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0)) \
        != gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0))

def test_block_equality_with_given_ids():
    assert gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0), 30) \
        == gi.Block('D', 'YELLOW', 'C', 'ORANGE', (-1, 2), 30)

def test_block_shift_to_keeps_id():
    base_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0))
    shifted_block = base_block.shift_to((2, 3))

    assert base_block.block_id == shifted_block.block_id

def test_block_shift_to_keeps_visuals():
    base_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0))
    shifted_block = base_block.shift_to((2, 3))

    assert base_block.side1_letter == shifted_block.side1_letter
    assert base_block.side1_color == shifted_block.side1_color
    assert base_block.side2_letter == shifted_block.side2_letter
    assert base_block.side2_color == shifted_block.side2_color

def test_block_shift_to_updates_pos():
    new_pos = (2, 3)
    base_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0))
    shifted_block = base_block.shift_to(new_pos)

    assert shifted_block.position == new_pos

def test_block_flip_keeps_block_id():
    base_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0))
    flipped_block = base_block.flip()

    assert base_block.block_id == flipped_block.block_id


def test_block_flip_keeps_pos():
    base_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0))
    flipped_block = base_block.flip()

    assert base_block.position == flipped_block.position

def test_block_flip_swaps_visuals():
    base_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0))
    flipped_block = base_block.flip()

    assert base_block.side1_letter == flipped_block.side2_letter
    assert base_block.side1_color == flipped_block.side2_color
    assert base_block.side2_letter == flipped_block.side1_letter
    assert base_block.side2_color == flipped_block.side1_color
