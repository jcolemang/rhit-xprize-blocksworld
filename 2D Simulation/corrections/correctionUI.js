const correctionUI = new function () {
    const incorrect_button = $("#buttonIncorrect");
    const correctionsModalURL = 'corrections/correctionsModal.html'
    const flipModalURL = 'corrections/flipModal.html';
    const moveModalURL = 'corrections/moveModal.html';

    incorrect_button.prop("disabled", true);

    this.show_corrections_modal = function () {
        openStickyModal(correctionsModalURL);
    };

    this.hide_corrections_modal = closeModal;

    this.display_flip_explanation = function () {
        openStickyModal(flipModalURL);
    };

    this.hide_flip_modal = closeModal;

    this.display_move_explanation = function () {
        openStickyModal(moveModalURL);
    };

    this.hide_move_modal = closeModal;

    this.disable_incorrect_button = function () {
        incorrect_button.prop("disabled", true);
    };

    this.enable_incorrect_button = function () {
        incorrect_button.prop("disabled", false);
        blocks.display_block_letters();
    };
};
