$(document).foundation();

(function() {

    var loader;
    //var allWindows = [].slice.call( document.querySelectorAll('.window'));

    function init() {

        /*for(var i = 0; i < allWindows.length; i++) {
            allWindows[i].addEventListener('mouseenter', showWindowOverlay, false);
            //allWindows[i].addEventListener('mouseleave', hideWindowOverlay, false);
        }*/

        $('.window').hover(
            function() {
                console.log($(this).children('.window__overlay'));
                if($(this).children('.window__overlay').hasClass('show') || $(this).children('.window__overlay').hasClass('pageload-loading')){
                    console.log('zdsfsdf');
                    throw new Error('FUCK');
                }
                else{
                    loader = new SVGLoader(
                        this.querySelector( '.window__overlay' ),
                        {
                            speedIn : 500,
                            easingIn : mina.easeinout
                        }
                    );

                    loader.show();
                }
            },
            function() {


                loader.hide();
            }
        );

    }

    /*function showWindowOverlay() {
        var loader = new SVGLoader(
            this.querySelector( '.window__overlay' ),
            {
                speedIn : 500,
                easingIn : mina.easeinout
            }
        );

        loader.show();
    }

    function hideWindowOverlay() {
        var loader = new SVGLoader(
            this.querySelector( '.window__overlay' ),
            {
                speedIn : 500,
                easingIn : mina.easeinout
            }
        );

        loader.hide();
    }*/

    init();

})();