jQuery(document).ready(function($) {
    var currentTab = 0;
    var totalTabs = $('.nums').length;
    var isScrolling = false;
    var sectionActivated = false;
    var lastScrollTop = 0; // To track scroll direction
    var touchStartY = 0; // To track touch start position

    // Disable scrolling on the entire page
    function disableScroll() {
        $('body').css('overflow', 'hidden');
    }

    // Re-enable scrolling on the entire page
    function enableScroll() {
        $('body').css('overflow', 'auto');
    }

    // Function to check if the section is exactly at the top of the viewport
    function isSectionAtTop(element) {
        var elementTop = $(element).offset().top;
        var viewportTop = $(window).scrollTop();
        return elementTop <= viewportTop && (viewportTop - elementTop) < $(element).outerHeight();
    }

    // Function to check if the section is at the bottom of the viewport
    function isSectionAtBottom(element) {
        var elementBottom = $(element).offset().top + $(element).outerHeight();
        var viewportBottom = $(window).scrollTop() + $(window).height();
        return elementBottom >= viewportBottom && (elementBottom - viewportBottom) < $(element).outerHeight();
    }

    // Function to check if another section is in the viewport
    function isOtherSectionInView(element) {
        var elementTop = $(element).offset().top;
        var elementBottom = elementTop + $(element).outerHeight();
        var viewportTop = $(window).scrollTop();
        var viewportBottom = viewportTop + $(window).height();

        return (elementBottom > viewportTop && elementTop < viewportBottom);
    }

    // Lock the section once it reaches the top
    function lockSection() {
        $('.slikJobberSection').css({
            'position': 'fixed',
            'top': '0',
            'left': '0',
            'width': '100%',
            'z-index': '9999'
        });
        disableScroll();
    }

    // Unlock the section to allow normal scrolling
    function unlockSection() {
        $('.slikJobberSection').css({
            'position': 'sticky',
            'top': '0',
            'z-index': '3',
            'max-height': '100vh',
        });
        enableScroll();
    }

    // Set initial background image
    var firstBg = $('.carousel-item.active').data('bg');
    if (firstBg) {
        $('#sliderMain').css('background-image', 'url(' + firstBg + ')');
    }

    // Handle tab click manually
    $('.nums').click(function() {
        $('.nums').removeClass('active');
        $(this).addClass('active');
        currentTab = $(this).index();
        var slideTo = $(this).data('slide-to');
        $('#customCarousel').carousel(slideTo);

        var newBg = $('.carousel-item').eq(slideTo).data('bg');
        if (newBg) {
            $('#sliderMain').css('background-image', 'url(' + newBg + ')');
        }
    });

    // Handle carousel slide change
    $('#customCarousel').on('slide.bs.carousel', function(e) {
        var index = $(e.relatedTarget).index();
        currentTab = index;
        var newBg = $('.carousel-item').eq(index).data('bg');
        if (newBg) {
            $('#sliderMain').css('background-image', 'url(' + newBg + ')');
        }
    });

    // Track scroll direction and handle section lock/unlock accordingly
    $(window).on('scroll', function() {
        var st = $(this).scrollTop(); // Get current scroll position

        // Determine if scrolling down or up
        var isScrollingDown = st > lastScrollTop;
        var isScrollingUp = st < lastScrollTop;
        lastScrollTop = st; // Update last scroll position

        // Lock the section only if scrolling down and it's not the last tab
        if (isScrollingDown && isSectionAtTop('.slikJobberSection') && !sectionActivated && currentTab < totalTabs - 1) {
            lockSection();
            sectionActivated = true;
            disableScroll();
        }

        console.log(isScrollingUp, isSectionAtBottom('.slikJobberSection'), currentTab === totalTabs - 1, !isOtherSectionInView('.leveranseSection'))

        // New condition: Lock the section when scrolling up, it's at the bottom, and no other section is in view
        var $currentSection = $('.slikJobberSection');
        var $nextSection = $currentSection.next('section');
        if (isScrollingUp && isSectionAtBottom('.slikJobberSection') && currentTab === totalTabs - 1 && !isOtherSectionInView($nextSection)) {
            lockSection(); // Lock the section when scrolling up from the bottom
            sectionActivated = true;
            disableScroll();
        }
    });

    // Handle wheel event to switch between tabs and unlock the section after the last tab
    $(window).on('wheel', function(event) {
        if (!sectionActivated || isScrolling) return; // Only activate if the section is at the top

        var delta = event.originalEvent.deltaY;

        if (delta > 0) { // Scrolling down
            if (currentTab < totalTabs - 1) {
                // Move to the next tab
                currentTab++;
                $('.nums').eq(currentTab).trigger('click');
            } else {
                // On the last tab, unlock the section but do NOT auto-scroll
                unlockSection(); // Properly unlock the section
                sectionActivated = false; // Deactivate section lock
                enableScroll();
            }
        } else { // Scrolling up
            if (currentTab > 0) {
                // Move to the previous tab
                currentTab--;
                $('.nums').eq(currentTab).trigger('click');
            } else {
                // On the last tab, unlock the section but do NOT auto-scroll
                unlockSection(); // Properly unlock the section
                sectionActivated = false; // Deactivate section lock
                enableScroll();
            }
        }

        isScrolling = true;
        setTimeout(function() {
            isScrolling = false;
        }, 800);

        event.preventDefault();
    });

    // Handle touch events for mobile scrolling
    $(window).on('touchstart', function(event) {
        touchStartY = event.originalEvent.touches[0].clientY; // Capture the starting Y position of the touch
    });

    $(window).on('touchmove', function(event) {
        if (!sectionActivated || isScrolling) return;

        var touchEndY = event.originalEvent.touches[0].clientY; // Capture the ending Y position of the touch
        var touchDelta = touchStartY - touchEndY;

        if (touchDelta > 0) { // Swiping up (equivalent to scrolling down)
            if (currentTab < totalTabs - 1) {
                currentTab++;
                $('.nums').eq(currentTab).trigger('click');
            } else {
                unlockSection(); // Unlock after the last tab
                sectionActivated = false;
                enableScroll();
            }
        } else if (touchDelta < 0) { // Swiping down (equivalent to scrolling up)
            if (currentTab > 0) {
                currentTab--;
                $('.nums').eq(currentTab).trigger('click');
            } else {
                unlockSection(); // Unlock after reaching the first tab
                sectionActivated = false;
                enableScroll();
            }
        }

        isScrolling = true;
        setTimeout(function() {
            isScrolling = false;
        }, 800);

        event.preventDefault(); // Prevent the default touch action
    });
});

// Select all elements with the class 'section'
var sections = document.querySelectorAll('.section');

// Loop through each .section element
sections.forEach(function(section, index) {
    // Set the z-index property based on the index (starting from 0)
    section.style.zIndex = index;
});

