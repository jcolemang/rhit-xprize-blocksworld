let _invalidMoveModalURL = "invalidMove/invalidMoveModal.html";

socket.on('indicate_impossible_move', function(move) {
    openStickyModal(_invalidMoveModalURL);

    let color = move['predicted_color'];
    let letter = move['predicted_letter'];
    let message =
        'I think that this is an impossible move. '
        + 'My prediction is that you are trying to move the '
        + color + ' '
        + letter + '. '
        + 'Please check that this move is possible.';

    _setInvalidModalContents(message);
});

socket.on('indicate_ambiguous_move', function(move) {
    openStickyModal(_invalidMoveModalURL);

    let color = move['predicted_color'] || 'Ambiguous';
    let letter = move['predicted_letter'] || 'Ambiguous';
    let message =
        'I think that this is an ambiguous move. '
        + 'Please try a more specific instruction.<br />'
        + 'Predicted color: ' + color + '<br />'
        + 'Predicted letter: ' + letter;

    _setInvalidModalContents(message);
});

function _setInvalidModalContents(message) {
    setTimeout(() => $('#invalidMoveModalContents').html(message), 10);
}
