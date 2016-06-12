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
    pageInfo = {
        title: document.title,
        url: location.href,
        id: $('.page-wrapper').attr('id')
    },
    pageLanding = $('#landing'),
    pageDummy = $('#page-dummy');


$('a.window').click(function(e){
    e.preventDefault();

    // Get the clicked window
    var window = $(this);
    console.log(window);

    // Get the url to load
    urlToLoad = window.attr('href');
    console.log(urlToLoad);

    // Load the page
    loadPage(urlToLoad, window);

});


function loadPage(urlToLoad, window, fromBigWindow = false) {

    var windowText, windowElementForEndTransition;

    // Create the window placeholder if it is not already here
    //if($('.window__placeholder').length)
    var placeholder = $('<div class="window__placeholder"></div>');

    placeholder.css({
        width: window.outerWidth() + 'px',
        height: window.outerHeight() + 'px'
    });

    // Animate texts
    var windowSuptitle = window.find('.window__suptitle');
    var windowTitle = window.find('.window__title');
    var windowSubtitle = window.find('.window__subtitle');
    if(fromBigWindow){
        windowText = window.find('.window__text');
    }

    windowSuptitle.addClass('window__suptitle--loading');
    windowTitle.addClass('window__title--loading');
    windowSubtitle.addClass('window__subtitle--loading');
    if(fromBigWindow && windowText.length > 0){
        windowText.addClass('window__text--loading');
    }

    // If we are coming from a Big Window, the windowText transition is > than the windowSuptitle transition
    if(fromBigWindow && windowText.length > 0){
        windowElementForEndTransition = windowText;
    }
    else{
        windowElementForEndTransition = windowSuptitle;
    }
    
    // At the end of texts animations
    onEndTransition(windowElementForEndTransition[0], function() {
        console.log('stop windowElementForEndTransition transition');

        // Add the window placeholder
        placeholder.appendTo(window);

        alert('bite');

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

}


function pageLoaded(data){

    console.log('page loaded');

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

    // Change the browser history
    pageInfo.title = bigTitle.text();
    pageInfo.url = urlToLoad;
    pageInfo.id = pageWrapper.attr('id');
    history.pushState(pageInfo, pageInfo.title, pageInfo.url);
    console.log(history);

    // Change the title
    document.title = pageInfo.title;

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
    event.preventDefault();

    console.log(event);
    console.log(event.state);

    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));

    console.log(history);
    console.log(history.state);

    urlToLoad = document.location;
    var window = $('#big-window');



    // Load the page
    loadPage(urlToLoad, window, true);

};


// TODO : changer le title au chargement de la page également ++ faire un pushstate au load de la page également pour corriger le event.state null