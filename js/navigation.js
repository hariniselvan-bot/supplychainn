/* =========================================================
   STACKLY — navigation.js

   Header
   Mobile menu
   Services dropdown
   Active navigation
   404 previous page + exact scroll position
   Page veil transitions
========================================================= */

(function () {

    'use strict';


    /* =========================================================
       HEADER
    ========================================================= */

    var header =
        document.querySelector('.sl-header');


    function onScroll() {

        if (!header) return;

        header.classList.toggle(
            'is-scrolled',
            window.scrollY > 40
        );

    }


    window.addEventListener(
        'scroll',
        onScroll,
        { passive: true }
    );


    onScroll();


    /* =========================================================
       SAVE CURRENT LOCATION
    ========================================================= */

    function saveReturnLocation() {

        var page =
            window.location.pathname;


        var hash =
            window.location.hash || "";


        var scrollPosition =
            Math.round(window.scrollY);


        sessionStorage.setItem(
            "stacklyReturnPage",
            page
        );


        sessionStorage.setItem(
            "stacklyReturnHash",
            hash
        );


        sessionStorage.setItem(
            "stacklyReturnScroll",
            String(scrollPosition)
        );

    }


    /*
     * Save the position continuously.
     *
     * This is what allows 404 Go Back
     * to return to the exact section even
     * when there is NO #section in the URL.
     */

    var scrollSaveTimer = null;


    window.addEventListener(
        "scroll",
        function () {

            clearTimeout(
                scrollSaveTimer
            );


            scrollSaveTimer =
                setTimeout(
                    function () {

                        saveReturnLocation();

                    },
                    100
                );

        },
        { passive: true }
    );


    /*
     * Save immediately.
     */

    saveReturnLocation();


    /*
     * Save hash changes.
     */

    window.addEventListener(
        "hashchange",
        function () {

            saveReturnLocation();

        }
    );


    /*
     * Save before leaving page.
     */

    window.addEventListener(
        "beforeunload",
        function () {

            saveReturnLocation();

        }
    );


    /* =========================================================
       RESTORE PREVIOUS SCROLL POSITION
    ========================================================= */

    function restoreScrollPosition() {

        var savedScroll =
            sessionStorage.getItem(
                "stacklyRestoreScroll"
            );


        if (
            savedScroll === null
        ) {

            return;

        }


        sessionStorage.removeItem(
            "stacklyRestoreScroll"
        );


        var scrollY =
            parseInt(
                savedScroll,
                10
            );


        if (
            isNaN(scrollY)
        ) {

            return;

        }


        /*
         * Wait until page content is rendered.
         */

        window.setTimeout(
            function () {

                window.scrollTo(
                    {
                        top: scrollY,
                        left: 0,
                        behavior: "instant"
                    }
                );

            },
            100
        );


        /*
         * Second attempt for pages
         * with images / animations.
         */

        window.setTimeout(
            function () {

                window.scrollTo(
                    {
                        top: scrollY,
                        left: 0,
                        behavior: "instant"
                    }
                );

            },
            500
        );

    }


    /*
     * Only restore when coming back
     * from the 404 page.
     */

    restoreScrollPosition();


    /* =========================================================
       MOBILE MENU
    ========================================================= */

    var burger =
        document.querySelector(
            '.sl-burger'
        );


    var menu =
        document.querySelector(
            '#sl-mobile-menu'
        );


    if (
        burger &&
        menu
    ) {

        var menuOpen = false;


        function setMenu(open) {

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
                open
                    ? 'true'
                    : 'false'
            );


            menu.classList.toggle(
                'is-open',
                open
            );


            menu.setAttribute(
                'aria-hidden',
                open
                    ? 'false'
                    : 'true'
            );


            document.body.classList.toggle(
                'menu-open',
                open
            );


            document.body.style.overflow =
                open
                    ? 'hidden'
                    : '';


            menu.style.visibility =
                open
                    ? 'visible'
                    : 'hidden';


            if (
                open &&
                window.gsap
            ) {

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

        }


        burger.addEventListener(
            'click',
            function () {

                setMenu(
                    !menuOpen
                );

            }
        );


        menu.querySelectorAll(
            'a'
        ).forEach(
            function (a) {

                a.addEventListener(
                    'click',
                    function () {

                        if (
                            menuOpen
                        ) {

                            setMenu(
                                false
                            );

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

                    setMenu(
                        false
                    );

                }

            }
        );


        window.__slCloseMenu =
            function () {

                if (menuOpen) {

                    setMenu(
                        false
                    );

                }

            };

    }


    /* =========================================================
       SERVICES DROPDOWN
    ========================================================= */

    document
        .querySelectorAll(
            '.sl-has-dropdown'
        )
        .forEach(
            function (item) {

                var link =
                    item.querySelector(
                        '.sl-nav-link'
                    );


                var dropdown =
                    item.querySelector(
                        '.sl-dropdown'
                    );


                if (
                    !link ||
                    !dropdown
                ) {

                    return;

                }


                link.setAttribute(
                    'aria-haspopup',
                    'true'
                );


                link.setAttribute(
                    'aria-expanded',
                    'false'
                );


                function openDropdown(
                    value
                ) {

                    item.classList.toggle(
                        'open',
                        value
                    );


                    link.setAttribute(
                        'aria-expanded',
                        value
                            ? 'true'
                            : 'false'
                    );

                }


                link.addEventListener(
                    'click',
                    function (e) {

                        e.preventDefault();

                        openDropdown(
                            !item.classList.contains(
                                'open'
                            )
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

                            openDropdown(
                                true
                            );

                        }

                    }
                );


                item.addEventListener(
                    'mouseleave',
                    function () {

                        openDropdown(
                            false
                        );

                    }
                );


                document.addEventListener(
                    'click',
                    function (e) {

                        if (
                            !item.contains(
                                e.target
                            )
                        ) {

                            openDropdown(
                                false
                            );

                        }

                    }
                );

            }
        );


    /* =========================================================
       ACTIVE NAVIGATION
    ========================================================= */

    var currentPath =
        window.location.pathname
            .split('/')
            .pop() ||
        'index.html';


    document
        .querySelectorAll(
            '.sl-nav-links a[href], .sl-mobile-menu a[href]'
        )
        .forEach(
            function (a) {

                a.classList.remove(
                    'is-active'
                );

            }
        );


    document
        .querySelectorAll(
            '.sl-nav-links a[href], .sl-mobile-menu a[href]'
        )
        .forEach(
            function (a) {

                var href =
                    a.getAttribute(
                        'href'
                    );


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

            }
        );


    /* =========================================================
       PAGE VEIL
    ========================================================= */

    var veil =
        document.querySelector(
            '.sl-veil'
        );


    if (
        veil &&
        window.gsap
    ) {


        gsap.killTweensOf(
            veil
        );


        gsap.set(
            veil,
            {
                scaleY: 0,
                transformOrigin: 'top'
            }
        );


        veil.style.pointerEvents =
            'none';


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
                    delay: .05,
                    ease: 'power3.inOut',

                    onComplete:
                        function () {

                            veil.style.pointerEvents =
                                'none';

                        }

                }
            );

        }


        /* =====================================================
           NAVIGATION
        ===================================================== */

        document.addEventListener(
            'click',
            function (event) {

                var link =
                    event.target.closest(
                        'a[href]'
                    );


                if (!link) return;


                var href =
                    link.getAttribute(
                        'href'
                    );


                if (!href) return;


                if (
                    href.charAt(0) === '#' ||
                    href.indexOf(
                        'javascript:'
                    ) === 0 ||
                    href.indexOf(
                        'mailto:'
                    ) === 0 ||
                    href.indexOf(
                        'tel:'
                    ) === 0 ||
                    link.target === '_blank' ||
                    link.hasAttribute(
                        'download'
                    ) ||
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey
                ) {

                    return;

                }


                var targetURL;


                try {

                    targetURL =
                        new URL(
                            href,
                            window.location.href
                        );

                } catch (
                    error
                ) {

                    return;

                }


                if (
                    targetURL.origin !==
                    window.location.origin
                ) {

                    return;

                }


                var currentURL =
                    new URL(
                        window.location.href
                    );


                /*
                 * Same-page section.
                 */

                if (
                    targetURL.pathname ===
                        currentURL.pathname &&
                    targetURL.hash
                ) {

                    return;

                }


                /*
                 * Only intercept HTML pages.
                 */

                if (
                    !targetURL.pathname
                        .toLowerCase()
                        .endsWith(
                            '.html'
                        )
                ) {

                    return;

                }


                /*
                 * VERY IMPORTANT:
                 *
                 * Save scroll position BEFORE
                 * navigating away.
                 */

                saveReturnLocation();


                if (
                    window.__slCloseMenu
                ) {

                    window.__slCloseMenu();

                }


                event.preventDefault();


                gsap.killTweensOf(
                    veil
                );


                gsap.set(
                    veil,
                    {
                        scaleY: 0,
                        transformOrigin: 'bottom'
                    }
                );


                veil.style.pointerEvents =
                    'auto';


                gsap.to(
                    veil,
                    {
                        scaleY: 1,
                        duration: .45,
                        ease: 'power3.inOut',

                        onComplete:
                            function () {

                                window.location.href =
                                    targetURL.href;

                            }

                    }
                );

            }
        );


        window.addEventListener(
            'pageshow',
            function () {

                revealPage();

            }
        );


        revealPage();


    } else {

        if (veil) {

            veil.style.transform =
                'scaleY(0)';

            veil.style.pointerEvents =
                'none';

        }

    }


})();