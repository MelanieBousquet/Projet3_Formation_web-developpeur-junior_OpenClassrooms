var Slider = {
    currentIndex: 0,

    init: function () {
        Slider.autoSlide();
        Slider.playAutoClick();
        Slider.nextSlideOnClick();
        Slider.prevSlideOnClick();
        Slider.changeSlideOnKeypress();
    },

    activeSlide: function () {
        var slides = $('.fade');
        var slide = slides.eq(Slider.currentIndex);
        slides.hide();
        slide.css('display', 'flex');
    },

    indexPlus: function () {
        var slides = $('.fade');
        var slidesNumber = slides.length;
        Slider.currentIndex += 1;
        if (Slider.currentIndex > slidesNumber - 1) {
            Slider.currentIndex = 0;
        }
    },

    indexMinus: function () {
        var slides = $('.fade');
        var slidesNumber = slides.length;
        Slider.currentIndex -= 1;
        if (Slider.currentIndex < 0) {
            Slider.currentIndex = slidesNumber - 1;
        }
    },

    autoSlide: function () {
        var play = $('.play');
        play.click(function () {
            var timer = setInterval(function () {
                Slider.indexPlus();
                Slider.activeSlide();
            }, 5000);
            var stop = $('.stop');
            stop.click(function () {
                clearInterval(timer);
            });
        });

    },

    playAutoClick: function () {
        var play = $('.play');
        play.trigger('click');
    },

    nextSlideOnClick: function () {
        var next = $('.next');
        next.click(function () {
            Slider.indexPlus();
            Slider.activeSlide();
        });
    },

    prevSlideOnClick: function () {
        var prev = $('.prev');
        prev.click(function () {
            Slider.indexMinus();
            Slider.activeSlide();
        });
    },

    changeSlideOnKeypress: function () {
        $('body').keydown(function (e) {
            if (e.which === 39) {
                Slider.indexPlus();
                Slider.activeSlide();
            } else if (e.which === 37) {
                Slider.indexMinus();
                Slider.activeSlide();
            }
        })
    },
}


$(function () {
    Slider.init();
});