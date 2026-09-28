/* =========================================================
   STACKLY — navigation.js
   Header behavior
   Mobile menu
   Services dropdown
   Active navigation
   Page veil transitions
========================================================= */

(function () {

    'use strict';


    /* =========================================================
       HEADER SCROLL
    ========================================================= */

    var header =
        document.querySelector('.sl-header');


    var onScroll = function () {

        if (!header) return;

        header.classList.toggle(
            'is-scrolled',
            window.scrollY > 40
        );

    };


    window.addEventListener(
        'scroll',
        onScroll,
        { passive: true }
    );


    onScroll();



    /* =========================================================
       MOBILE MENU
    ========================================================= */

    var burger =
        document.querySelector('.sl-burger');

    var menu =
        document.querySelector('#sl-mobile-menu');


    if (burger && menu) {

        var menuOpen = false;


        var setMenu = function (open) {

            menuOpen = open;


            burger.classList.toggle(
                'is-active',
                open
            );


            burger.classList.toggle(
                'is-open',
                open
            );


            burger.setAttribute(
                'aria-expanded',
                open ? 'true' : 'false'
            );


            menu.classList.toggle(
                'is-open',
                open
            );


            menu.setAttribute(
                'aria-hidden',
                open ? 'false' : 'true'
            );


            document.body.classList.toggle(
                'menu-open',
                open
            );


            document.body.style.overflow =
                open ? 'hidden' : '';


            menu.style.visibility =
                open ? 'visible' : 'hidden';


            if (open && window.gsap) {

                gsap.fromTo(
                    menu,
                    {
                        opacity: 0
                    },
                    {
                        opacity: 1,
                        duration: .35,
                        ease: 'power2.out'
                    }
                );


                gsap.fromTo(
                    menu.querySelectorAll(
                        '.sl-mobile-link, .sl-mobile-menu-foot > *'
                    ),
                    {
                        y: 28,
                        opacity: 0
                    },
                    {
                        y: 0,
                        opacity: 1,
                        stagger: .05,
                        duration: .5,
                        ease: 'power3.out',
                        delay: .12,
                        clearProps: 'all'
                    }
                );

            }

        };


        burger.addEventListener(
            'click',
            function () {

                setMenu(!menuOpen);

            }
        );


        menu.querySelectorAll('a').forEach(
            function (a) {

                a.addEventListener(
                    'click',
                    function () {

                        if (menuOpen) {

                            setMenu(false);

                        }

                    }
                );

            }
        );


        document.addEventListener(
            'keydown',
            function (e) {

                if (
                    e.key === 'Escape' &&
                    menuOpen
                ) {

                    setMenu(false);

                }

            }
        );


        window.__slCloseMenu =
            function () {

                if (menuOpen) {

                    setMenu(false);

                }

            };

    }



    /* =========================================================
       SERVICES DROPDOWN
    ========================================================= */

    document
        .querySelectorAll('.sl-has-dropdown')
        .forEach(function (item) {

            var link =
                item.querySelector('.sl-nav-link');

            var dd =
                item.querySelector('.sl-dropdown');


            if (!link || !dd) return;


            link.setAttribute(
                'aria-haspopup',
                'true'
            );


            link.setAttribute(
                'aria-expanded',
                'false'
            );


            var open = function (v) {

                item.classList.toggle(
                    'open',
                    v
                );


                link.setAttribute(
                    'aria-expanded',
                    v ? 'true' : 'false'
                );

            };


            link.addEventListener(
                'click',
                function (e) {

                    /*
                     * On desktop, allow the dropdown.
                     * On mobile, the normal navigation can
                     * be handled by the mobile menu.
                     */

                    e.preventDefault();

                    open(
                        !item.classList.contains('open')
                    );

                }
            );


            item.addEventListener(
                'mouseenter',
                function () {

                    if (
                        window.matchMedia(
                            '(hover:hover)'
                        ).matches
                    ) {

                        open(true);

                    }

                }
            );


            item.addEventListener(
                'mouseleave',
                function () {

                    open(false);

                }
            );


            document.addEventListener(
                'click',
                function (e) {

                    if (!item.contains(e.target)) {

                        open(false);

                    }

                }
            );

        });



    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    var currentPath =
        window.location.pathname
            .split('/')
            .pop() || 'index.html';


    /*
     * Remove existing active classes first.
     */

    document
        .querySelectorAll(
            '.sl-nav-links a[href], .sl-mobile-menu a[href]'
        )
        .forEach(function (a) {

            a.classList.remove(
                'is-active'
            );

        });


    /*
     * Desktop navigation
     */

    document
        .querySelectorAll(
            '.sl-nav-links a[href]'
        )
        .forEach(function (a) {

            var href =
                a.getAttribute('href');


            if (!href) return;


            /*
             * Remove #section from links
             */

            var cleanHref =
                href.split('#')[0];


            /*
             * Remove ./ if present
             */

            cleanHref =
                cleanHref.replace(
                    './',
                    ''
                );


            if (
                cleanHref === currentPath ||
                (
                    currentPath === '' &&
                    cleanHref === 'index.html'
                )
            ) {

                a.classList.add(
                    'is-active'
                );

            }

        });


    /*
     * Mobile navigation
     */

    document
        .querySelectorAll(
            '.sl-mobile-menu a[href]'
        )
        .forEach(function (a) {

            var href =
                a.getAttribute('href');


            if (!href) return;


            var cleanHref =
                href.split('#')[0];


            cleanHref =
                cleanHref.replace(
                    './',
                    ''
                );


            if (
                cleanHref === currentPath ||
                (
                    currentPath === '' &&
                    cleanHref === 'index.html'
                )
            ) {

                a.classList.add(
                    'is-active'
                );

            }

        });



    /* =========================================================
       PAGE VEIL TRANSITIONS
    ========================================================= */

    var veil =
        document.querySelector('.sl-veil');


    if (
        veil &&
        window.gsap
    ) {


        /* =====================================================
           INITIAL STATE
           VERY IMPORTANT
        ===================================================== */

        gsap.killTweensOf(veil);


        gsap.set(
            veil,
            {
                scaleY: 0,
                transformOrigin: 'top'
            }
        );


        /*
         * Make sure veil cannot block clicks
         * when page is visible.
         */

        veil.style.pointerEvents =
            'none';



        /* =====================================================
           REVEAL CURRENT PAGE
        ===================================================== */

        function revealPage() {

            gsap.killTweensOf(
                veil
            );


            gsap.set(
                veil,
                {
                    scaleY: 1,
                    transformOrigin: 'top'
                }
            );


            gsap.to(
                veil,
                {
                    scaleY: 0,
                    duration: .6,
                    ease: 'power3.inOut',
                    delay: .1,
                    onComplete: function () {

                        veil.style.pointerEvents =
                            'none';

                    }
                }
            );

        }



        /* =====================================================
           PAGE LINK CLICK
        ===================================================== */

        document.addEventListener(
            'click',
            function (e) {


                var a =
                    e.target.closest(
                        'a[href$=".html"], a[href^="./"][href$=".html"]'
                    );


                if (!a) return;


                var href =
                    a.getAttribute('href');


                if (!href) return;


                /*
                 * Ignore special links
                 */

                if (
                    href.charAt(0) === '#' ||
                    href.indexOf('javascript:') === 0 ||
                    a.target === '_blank' ||
                    e.metaKey ||
                    e.ctrlKey ||
                    e.shiftKey ||
                    e.altKey
                ) {

                    return;

                }


                /*
                 * Ignore same-page hash links
                 */

                if (
                    href.indexOf('#') !== -1
                ) {

                    var linkPage =
                        href.split('#')[0];


                    var thisPage =
                        window.location.pathname
                            .split('/')
                            .pop();


                    if (
                        linkPage === thisPage ||
                        linkPage === ''
                    ) {

                        return;

                    }

                }


                /*
                 * Save current page + section
                 * for 404 Go Back.
                 */

                var currentSection =
                    window.location.hash
                        .replace('#', '');


                sessionStorage.setItem(
                    'stacklyPreviousPage',
                    currentPath
                );


                if (currentSection) {

                    sessionStorage.setItem(
                        'stacklyPreviousSection',
                        currentSection
                    );

                } else {

                    sessionStorage.removeItem(
                        'stacklyPreviousSection'
                    );

                }



                e.preventDefault();


                if (
                    window.__slCloseMenu
                ) {

                    window.__slCloseMenu();

                }


                gsap.killTweensOf(
                    veil
                );


                /*
                 * START WITH VEIL HIDDEN
                 */

                gsap.set(
                    veil,
                    {
                        scaleY: 0,
                        transformOrigin: 'bottom'
                    }
                );


                /*
                 * Cover current page
                 */

                gsap.to(
                    veil,
                    {
                        scaleY: 1,
                        duration: .45,
                        ease: 'power3.inOut',

                        onComplete: function () {

                            window.location.href =
                                href;

                        }

                    }
                );

            }
        );



        /* =====================================================
           BROWSER BACK / FORWARD
        ===================================================== */

        window.addEventListener(
            'pageshow',
            function () {

                revealPage();

            }
        );


        /*
         * Also reveal immediately.
         * This is important for GitHub Pages.
         */

        revealPage();

    }

})();
