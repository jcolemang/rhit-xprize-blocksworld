const correctionUI = new function () {
    const incorrect_button = $("#buttonIncorrect");
    const correctionsModal = $("#correctionsModal");
    const flipModal = $("#flipModal");
    const moveModal = $("#moveModal");

    incorrect_button.prop("disabled", true);

    function openStickyModal(modalSelector) {
        modalSelector.modal({
            escapeClose: false,
            clickClose: false,
            showClose: false
        });
    }

    this.show_corrections_modal = function () {
        openStickyModal(correctionsModal);
    };

    this.hide_corrections_modal = $.modal.close;

    this.display_flip_explanation = function () {
        openStickyModal(flipModal);
    };

    this.hide_flip_modal = $.modal.close;

    this.display_move_explanation = function () {
        openStickyModal(moveModal);
    };

    this.hide_move_modal = $.modal.close;

    this.disable_incorrect_button = function () {
        incorrect_button.prop("disabled", true);
    };

    this.enable_incorrect_button = function () {
        incorrect_button.prop("disabled", false);
        blocks.display_block_letters();
    };
};
