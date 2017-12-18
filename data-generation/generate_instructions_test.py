import generate_instructions as gi

"""
Block tests
"""

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


"""
Configuration
"""

def test_is_complete_empty_current_empty_final():
    assert gi.Configuration([], []).is_complete()

def test_is_complete_nonempty_current_empty_final():
    assert not gi.Configuration([1], []).is_complete()

def test_is_complete_nonempty_current_nonempty_final():
    assert not gi.Configuration([1], [2]).is_complete()

def test_get_instruction_phrase():
    moved_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (1, 2))
    instruction = gi.Configuration.get_instruction(moved_block)

    assert 'A' in instruction.phrase
    assert 'BLUE' in instruction.phrase

def test_get_instruction_point():
    moved_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (1, 2))
    instruction = gi.Configuration.get_instruction(moved_block)

    assert instruction.point == (1, 2)

class TestGenerateAction:
    def setup_method(self):
        self.moved_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (1, 2), 1)
        self.destination_block = gi.Block('A', 'BLUE', 'B', 'GREEN', (2, 2), 1)

        self.goal_block = gi.Block('B', 'YELLOW', 'G', 'RED', (3, 3), 2)
        self.goal_config = gi.Configuration([], [self.destination_block, self.goal_block])

        self.instruction = gi.Instruction('Phrase', (2, 2))

        def mock_rand_element(blocks):
            return self.moved_block

        gi.rand_element = mock_rand_element

        def mock_get_instruction(block):
            return self.instruction

        gi.Configuration.get_instruction = mock_get_instruction

    def test_generate_action_complete_board(self):
        finished_configuration = gi.Configuration([])
        try:
            finished_configuration.generate_action(0)
            assert False
        except gi.NoActionException:
            assert True

    def test_generate_action_completing_board(self):
        base_config = gi.Configuration([self.moved_block], [self.goal_block])
        action = base_config.generate_action(self.goal_config)

        assert action.start_conf == base_config
        assert action.phrase == self.instruction

        self.assert_action_current_blocks(action)
        self.assert_action_final_blocks(action)

    def test_generate_action_not_completing_board(self):
        unmoved_block = gi.Block('B', 'YELLOW', 'G', 'RED', (3, 3), 2)
        base_config = gi.Configuration([self.moved_block, unmoved_block], [])

        action = base_config.generate_action(self.goal_config)

        assert action.start_conf == base_config
        assert action.phrase == self.instruction

        self.assert_action_current_blocks(action)
        self.assert_action_final_blocks(action)

    def assert_action_current_blocks(self, action):
        assert len(action.end_conf.current_blocks) \
            == len(action.start_conf.current_blocks) - 1

        for end_current_block in action.end_conf.current_blocks:
            assert end_current_block in action.start_conf.current_blocks

        assert self.moved_block not in action.end_conf.current_blocks

    def assert_action_final_blocks(self, action):
        assert len(action.end_conf.final_blocks) \
            == len(action.start_conf.final_blocks) + 1

        for start_goal_block in action.start_conf.final_blocks:
            assert start_goal_block in action.end_conf.final_blocks

        assert self.destination_block in action.end_conf.final_blocks

class TestScatter:
    def setup_method(self):
        self.unscattered_blocks = [gi.Block('A', 'BLUE', 'B', 'GREEN', (1, 1), 1),
                                   gi.Block('A', 'BLUE', 'B', 'GREEN', (1, 1), 2),
                                   gi.Block('A', 'BLUE', 'B', 'GREEN', (1, 1), 3),
                                   gi.Block('A', 'BLUE', 'B', 'GREEN', (1, 1), 4)]

        self.scattered_blocks = [gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0), 1),
                                 gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0), 2),
                                 gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0), 3),
                                 gi.Block('A', 'BLUE', 'B', 'GREEN', (0, 0), 4)]
        self.randomizer_index = 0

        def mock_randomize_block(block):
            to_return = self.scattered_blocks[self.randomizer_index]
            self.randomizer_index += 1
            return to_return

        gi.randomize_block = mock_randomize_block

    def test_scatter_empty(self):
        config = gi.Configuration([])
        scattered_config = config.scatter()

        assert scattered_config.current_blocks == []
        assert scattered_config.final_blocks == []

    def test_scatter_only_current(self):
        base_config = gi.Configuration(self.unscattered_blocks[:])
        scattered_config = base_config.scatter()

        assert scattered_config.final_blocks == []
        assert scattered_config.current_blocks == self.scattered_blocks

    def test_scatter_current_and_final(self):
        base_config = gi.Configuration(self.unscattered_blocks[0:2],
                                       self.unscattered_blocks[2:4])
        scattered_config = base_config.scatter()

        assert scattered_config.final_blocks == []
        assert scattered_config.current_blocks == self.scattered_blocks

def test_random_block():
    indexer = {}
    indexer['rand_index'] = 0
    def mock_rand_element(ls):
        to_return = ls[indexer['rand_index']]
        indexer['rand_index'] += 1
        return to_return
    gi.rand_element = mock_rand_element

    def mock_random_position():
        return random_position
    gi.random_position = mock_random_position

    random_position = (23, 54)

    letters = ['A', 'B', 'C', 'D']
    colors = ['BLUE', 'GREEN', 'RED', 'YELLOW']
    block = gi.random_block(letters, colors)

    assert block.side1_letter in letters
    assert block.side2_letter in letters
    assert block.side1_color in colors
    assert block.side2_color in colors
    assert block.position == random_position
