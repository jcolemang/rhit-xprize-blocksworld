let correctionUI = new function () {
    let incorrect_button = $("#buttonIncorrect");

    let correctionsModal = $("#correctionsModal");
    let flipModal = $("#flipModal");
    let moveModal = $("#moveModal");

    incorrect_button.prop("disabled", true);

    this.show_corrections_modal = function () {
        correctionsModal.css("display", "block");
    };

    this.hide_corrections_modal = function () {
        correctionsModal.css("display", "none");
    };

    this.display_flip_explanation = function () {
        flipModal.css("display", "block");
    };

    this.hide_flip_modal = function () {
        flipModal.css("display", "none");
    };

    this.display_move_explanation = function () {
        moveModal.css("display", "block");
    };

    this.hide_move_modal = function () {
        moveModal.css("display", "none");
    };

    this.disable_incorrect_button = function () {
        incorrect_button.prop("disabled", true);
    };

    this.enable_incorrect_button = function () {
        incorrect_button.prop("disabled", false);
        blocks.display_block_letters();
    };
};
