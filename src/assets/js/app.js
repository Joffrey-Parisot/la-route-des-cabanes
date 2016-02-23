$(document).foundation();

$('.window').click(function(e){

    e.preventDefault();

    var placeholder = $('<div class="window__placeholder"></div>');

    placeholder.css({
        top: $(this).outerHeight(true) + 'px',
        width: $(this).outerWidth() + 'px',
        height: $(this).outerHeight() + 'px'
    });

    placeholder.prependTo($(this).parent());

    setTimeout(function() {
        placeholder.addClass('window__placeholder--loading');
    }, 25);

});