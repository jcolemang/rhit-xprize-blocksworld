_movement_count_dict = {}

def generate_move(sid, gesture_data, message_data):
    """Returns the (position data, movement count) that will be sent to the
    client.

    """
    movement_ct = _movement_count_dict.setdefault(sid, 0) + 1
    _movement_count_dict[sid] = movement_ct

    return ({'top': gesture_data['top'],
             'left': gesture_data['left'],
             'block_id': 'block3'},
            movement_ct)
