function openModal(modalURL) {
    _openModal(modalURL, {
        showClose: false
    });
}

function openStickyModal(modalURL) {
    _openModal(modalURL, {
        escapeClose: false,
        clickClose: false,
        showClose: false
    });
}

function _openModal(modalURL, modalArgs) {
    gesture.hide();

    $.ajax({
        url: modalURL,
        dataType: 'html',
        success: (html) => {
            $(html).appendTo('body').modal(modalArgs);
        }
    });
}

function closeModal() {
    $.modal.close();
    $('.modal').remove();
}
