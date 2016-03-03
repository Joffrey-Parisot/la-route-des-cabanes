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
    };

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

        $.ajax({
            url: page,
            method: 'GET',
            dataType: 'html'
        })
        .success(function(data){
            //console.log(data);
            var pageWrapper = $(data).find('.page-wrapper');
            console.log(pageWrapper);
            $('.landing').after(pageWrapper);
        });

        /*var loader = $('<div class="loader"></div>');

        loader.load(page + " .page-wrapper");

        console.log(loader);*/

    });

});