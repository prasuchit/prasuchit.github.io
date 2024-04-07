/*!
* Start Bootstrap - Portfolio WebsiteS v7.0.3 (https://prasuchit.github.io)
* Copyright 2013-2024 undefined
* Licensed under undefined (https://github.com/StartBootstrap/prasuchit.github.io/blob/master/LICENSE)
*/
/*!
* Start Bootstrap - Portfolio WebsiteS v7.0.3 (undefined)
* Copyright 2013-2024 undefined
* Licensed under undefined (https://github.com/StartBootstrap/prasuchit.github.io/blob/master/LICENSE)
*/
//
// Scripts
// 

$(document).ready(function () {
    // Initialize the carousel
    $('#slideshow').carousel({
        interval: 900, // Change slide every 3 seconds
        pause: 'hover'
    });

    // Handle manual navigation
    $('#prevBtn').click(function () {
        $('#slideshow').carousel('prev');
    });

    $('#nextBtn').click(function () {
        $('#slideshow').carousel('next');
    });
});

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});
