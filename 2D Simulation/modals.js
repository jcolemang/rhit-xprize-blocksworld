function openStickyModal(modalURL) {
    $.ajax({
        url: modalURL,
        dataType: 'html',
        success: (html) => {
            $(html).appendTo('body').modal({
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
        }
    });
}

function closeModal() {
    $.modal.close();
    $('.modal').remove();
}
