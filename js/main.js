// Portfolio interactions: mobile nav, active-section highlight, reveal on scroll.
// No dependencies. The page is fully usable without this script.
(function () {
    'use strict';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var header = document.querySelector('.site-header');
    var toggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));

    // Footer year
    var year = document.getElementById('year');
    if (year) year.textContent = String(new Date().getFullYear());

    // Mobile menu
    function setMenu(open) {
        navLinks.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (toggle && navLinks) {
        toggle.addEventListener('click', function () {
            setMenu(toggle.getAttribute('aria-expanded') !== 'true');
        });
        links.forEach(function (link) {
            link.addEventListener('click', function () { setMenu(false); });
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
                setMenu(false);
                toggle.focus();
            }
        });
    }

    // Header border once scrolled
    function onScroll() {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var hasIO = 'IntersectionObserver' in window;

    // Active section highlight
    if (hasIO) {
        var byId = {};
        links.forEach(function (link) {
            byId[link.getAttribute('href').slice(1)] = link;
        });
        var sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                links.forEach(function (l) {
                    l.classList.remove('is-active');
                    l.removeAttribute('aria-current');
                });
                var active = byId[entry.target.id];
                if (active) {
                    active.classList.add('is-active');
                    active.setAttribute('aria-current', 'true');
                }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        document.querySelectorAll('main section[id]').forEach(function (s) {
            sectionObserver.observe(s);
        });
    }

    // Reveal on scroll (skipped entirely for reduced motion or old browsers)
    var revealEls = document.querySelectorAll('.reveal');
    if (reduceMotion || !hasIO) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }
    var revealObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
})();
