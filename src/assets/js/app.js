$(document).foundation();

var support = { transitions: Modernizr.csstransitions },
    transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' },
    transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
    onEndTransition = function( el, callback ) {
        var onEndCallbackFn = function( ev ) {
            if( support.transitions ) {
                if( ev.target != this ) return;
                this.removeEventListener( transEndEventName, onEndCallbackFn );
            }
            if( callback && typeof callback === 'function' ) { callback.call(this); }
        };
        if( support.transitions ) {
            el.addEventListener( transEndEventName, onEndCallbackFn );
        }
        else {
            onEndCallbackFn();
        }
    },
    pageLanding = $('.landing'),
    pageDummy = $('.page-dummy');

$('.window').click(function(e){

    e.preventDefault();

    var page = $(this).attr('href');
    console.log(page);

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

    onEndTransition(placeholder[0], function() {
        console.log('stop transition');

        pageDummy.addClass('page-dummy--show');

        $.ajax({
            url: page,
            method: 'GET',
            dataType: 'html',
            success: pageLoaded
        });

    });

});


function pageLoaded(data){

    // Get the new Page Wrapper from Ajax
    var pageWrapper = $(data).find('.page-wrapper');

    // Hide the Landing block
    pageLanding.addClass('page-wrapper--hide');

    // Add the new Page Wrapper after the Landing block
    pageLanding.after(pageWrapper);

    // TODO
    // ajouter une window qui fait l'effet inverse de celle qui s'agrandit
    // Cette window sera la placeholder de la vraie
    // La vraie est celle en taille normal de la page qui vient de l'ajax
    // On cache le dummy et on rétrécit la nouvelle window placeholder pour enfin voir la nouvelle page


    // Hide the Dummy
    //pageDummy.removeClass('page-dummy--show');


}