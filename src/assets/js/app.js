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
    urlToLoad,
    pageLanding = $('.landing'),
    pageDummy = $('#page-dummy');


$('a.window').click(function(e){

    e.preventDefault();

    // Get the clicked window
    var window = $(this);
    console.log(window);

    // Get the url to load
    urlToLoad = window.attr('href');
    console.log(urlToLoad);

    // Create the window placeholder
    var placeholder = $('<div class="window__placeholder"></div>');

    placeholder.css({
        width: window.outerWidth() + 'px',
        height: window.outerHeight() + 'px'
    });

    // Animate texts
    var windowSuptitle = window.find('.window__suptitle');
    var windowTitle = window.find('.window__title');
    var windowSubtitle = window.find('.window__subtitle');

    windowSuptitle.addClass('window__suptitle--loading');
    windowTitle.addClass('window__title--loading');
    windowSubtitle.addClass('window__subtitle--loading');

    // At the end of texts animations
    onEndTransition(windowSuptitle[0], function() {
        console.log('stop windowSuptitle transition');

        // Add the window placeholder
        placeholder.appendTo(window);

        // And animate it
        setTimeout(function() {
            placeholder.addClass('window__placeholder--loading');
        }, 150);

        // At the end of the window placeholder animation
        onEndTransition(placeholder[0], function() {
            console.log('stop placeholder transition');

            // Show the dummy page
            pageDummy.addClass('page-dummy--show');

            // And load the new page
            $.ajax({
                url: urlToLoad,
                method: 'GET',
                dataType: 'html',
                success: pageLoaded
            });
        });
    });

});


function pageLoaded(data){

    console.log('page loaded');

    // Change the browser history
    var stateObj = { page: 1 };
    history.pushState(stateObj, document.title, urlToLoad);

    // Get the new page wrapper from Ajax
    var pageWrapper = $(data).find('.page-wrapper');

    // Hide the landing block
    pageLanding.addClass('page-wrapper--hide');

    // Add the new page wrapper after the landing block
    pageLanding.after(pageWrapper);

    // Get the big window and its children
    var bigWindow = pageWrapper.find('#big-window');
    var bigSupTitle = bigWindow.find('.window__suptitle');
    var bigTitle = bigWindow.find('.window__title');
    var bigSubTitle = bigWindow.find('.window__subtitle');
    var bigText = bigWindow.find('.window__text');

    // Hide children
    bigSupTitle.addClass('window__suptitle--loading');
    bigTitle.addClass('window__title--loading');
    bigSubTitle.addClass('window__subtitle--loading');
    bigText.addClass('window__text--loading');

    // Create the big window placeholder
    var bigPlaceholder = $('<div class="window__placeholder window__placeholder--loading"></div>');

    bigPlaceholder.css({
        width: bigWindow.outerWidth() + 'px',
        height: bigWindow.outerHeight() + 'px'
    });

    bigPlaceholder.appendTo(bigWindow);

    // Hide the dummy page
    setTimeout(function() {
        pageDummy.removeClass('page-dummy--show');
    }, 150);

    // At the end of the dummy page animation
    onEndTransition(pageDummy[0], function() {
        console.log('stop dummy page transition');

        // Animate the big window placeholder
        setTimeout(function() {
            bigPlaceholder.removeClass('window__placeholder--loading');
        }, 150);
    });

    // At the end of the big window placeholder animation
    onEndTransition(bigPlaceholder[0], function() {
        console.log('stop big placeholder transition');

        // Fade it
        bigPlaceholder.addClass('window__placeholder--shrink');

        // At the end of the big window placeholder animation again
        onEndTransition(bigPlaceholder[0], function() {
            console.log('stop big placeholder transition again');

            // Hide it
            bigPlaceholder.addClass('window__placeholder--hide');
            bigPlaceholder.removeClass('window__placeholder--shrink');

            // And show children
            bigSupTitle.removeClass('window__suptitle--loading');
            bigTitle.removeClass('window__title--loading');
            bigSubTitle.removeClass('window__subtitle--loading');
            bigText.removeClass('window__text--loading');
        });
    });

}

window.onpopstate = function(event) {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));

};