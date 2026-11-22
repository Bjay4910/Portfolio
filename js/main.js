/*
 * Portfolio interactions. No dependencies; the page is fully readable without it.
 * Desktop effects run only while (min-width: 768px) and (pointer: fine) and no
 * reduced-motion preference; they switch off live if that changes.
 */
(function () {
    'use strict';

    var d = document;
    var root = d.documentElement;
    var cfg = window.SITE_CONFIG || { demos: {}, repos: {} };
    var hasIO = 'IntersectionObserver' in window;
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var mqFx = window.matchMedia('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    var mqLight = window.matchMedia('(prefers-color-scheme: light)');
    var $ = function (sel, ctx) { return (ctx || d).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || d).querySelectorAll(sel)); };
    var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
    var onMq = function (mq, fn) { mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn); };
    var idle = window.requestIdleCallback
        ? function (cb) { window.requestIdleCallback(cb, { timeout: 1500 }); }
        : function (cb) { setTimeout(cb, 200); };
    var reduced = function () { return mqReduce.matches; };
    var safeUrl = function (u) { return typeof u === 'string' && /^https:\/\//.test(u.trim()) ? u.trim() : ''; };

    var year = $('#year');
    if (year) year.textContent = String(new Date().getFullYear());

    // The contact address is read from the page itself (single source of truth).
    var mailLink = $('a[href^="mailto:"]');
    var EMAIL = mailLink ? mailLink.getAttribute('href').replace(/^mailto:/, '').split('?')[0] : '';

    /* ---------------- Toast + clipboard ---------------- */
    var toastEl = $('#toast');
    var toastTimer;
    function toast(msg) {
        if (!toastEl) return;
        toastEl.textContent = msg;
        toastEl.classList.add('is-on');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            toastEl.classList.remove('is-on');
            setTimeout(function () { toastEl.textContent = ''; }, 300);
        }, 2200);
    }
    function copyText(text) {
        function fallback() {
            var ta = d.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            d.body.appendChild(ta);
            ta.select();
            var ok = false;
            try { ok = d.execCommand('copy'); } catch (e) {}
            ta.remove();
            toast(ok ? 'Email copied to clipboard' : 'Copy failed: ' + text);
        }
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () { toast('Email copied to clipboard'); }, fallback);
        } else {
            fallback();
        }
    }
    $$('.copy-email').forEach(function (b) {
        b.addEventListener('click', function () { copyText(b.getAttribute('data-copy') || EMAIL); });
    });

    /* ---------------- Theme ---------------- */
    var themeBtn = $('#themeToggle');
    var metaTheme = $('meta[name="theme-color"]');
    function effectiveTheme() {
        var t = root.getAttribute('data-theme');
        return t === 'light' || t === 'dark' ? t : (mqLight.matches ? 'light' : 'dark');
    }
    function syncTheme() {
        var t = effectiveTheme();
        root.setAttribute('data-theme-effective', t);
        if (themeBtn) themeBtn.setAttribute('aria-label', 'Switch to ' + (t === 'dark' ? 'light' : 'dark') + ' theme');
        if (metaTheme) metaTheme.setAttribute('content', t === 'dark' ? '#0b0e14' : '#f6f7f9');
        window.dispatchEvent(new CustomEvent('themechange', { detail: t }));
    }
    function toggleTheme() {
        var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        syncTheme();
        toast((next === 'dark' ? 'Dark' : 'Light') + ' theme');
    }
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    onMq(mqLight, syncTheme);
    syncTheme();

    /* ---------------- Mobile menu ---------------- */
    var toggle = $('#navToggle');
    var navLinks = $('#navLinks');
    var links = $$('.nav-link');
    function setMenu(open) {
        if (!navLinks || !toggle) return;
        navLinks.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    }
    if (toggle && navLinks) {
        toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
        links.forEach(function (l) { l.addEventListener('click', function () { setMenu(false); }); });
        d.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navLinks.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
        });
    }

    /* ---------------- Active section highlight ---------------- */
    if (hasIO) {
        var byId = {};
        links.forEach(function (l) { byId[l.getAttribute('href').slice(1)] = l; });
        var secObs = new IntersectionObserver(function (entries) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                links.forEach(function (l) { l.classList.remove('is-active'); l.removeAttribute('aria-current'); });
                var a = byId[en.target.id];
                if (a) { a.classList.add('is-active'); a.setAttribute('aria-current', 'true'); }
            });
        }, { rootMargin: '-45% 0px -50% 0px' });
        $$('main section[id]').forEach(function (s) { secObs.observe(s); });
    }

    /* ---------------- Reveal on scroll ---------------- */
    var revealEls = $$('.reveal');
    if (reduced() || !hasIO) {
        revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
        var revObs = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); }
            });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
        revealEls.forEach(function (el) { revObs.observe(el); });
    }

    /* ---------------- Counters (final values already in the HTML) ---------------- */
    var counters = $$('[data-count]');
    if (hasIO && !reduced()) {
        var cntObs = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (en) {
                if (!en.isIntersecting) return;
                obs.unobserve(en.target);
                var el = en.target;
                var target = parseFloat(el.getAttribute('data-count'));
                var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
                var final = el.textContent;
                var start = performance.now();
                var dur = 1300;
                (function step(now) {
                    var p = clamp((now - start) / dur, 0, 1);
                    var eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = p < 1 ? (target * eased).toFixed(dec) : final;
                    if (p < 1) requestAnimationFrame(step);
                })(start);
            });
        }, { threshold: 0.6 });
        counters.forEach(function (c) { cntObs.observe(c); });
    }

    /* ---------------- Rotating role line ---------------- */
    var hero = $('#home');
    var heroRole = $('#heroRole');
    var heroInView = true;
    var rotTimer = null;
    var rotWord;
    var ROLES = ['Software Engineer', 'Agentic AI', 'Distributed Systems'];
    var roleIdx = 0;
    function rotStep() {
        rotWord.classList.add('is-out');
        setTimeout(function () {
            roleIdx = (roleIdx + 1) % ROLES.length;
            rotWord.textContent = ROLES[roleIdx];
            rotWord.classList.remove('is-out');
        }, 350);
    }
    function rotSync() {
        var should = rotWord && !reduced() && heroInView && !d.hidden;
        if (should && !rotTimer) rotTimer = setInterval(rotStep, 2600);
        else if (!should && rotTimer) { clearInterval(rotTimer); rotTimer = null; }
    }
    function rotSetup() {
        if (!heroRole) return;
        var rot = $('.role-rotator', heroRole);
        if (reduced()) {
            heroRole.classList.remove('is-rotating');
        } else {
            if (!rotWord) {
                rotWord = d.createElement('span');
                rotWord.className = 'role-word';
                rotWord.textContent = ROLES[0];
                rot.appendChild(rotWord);
            }
            heroRole.classList.add('is-rotating');
        }
        rotSync();
    }
    rotSetup();
    onMq(mqReduce, rotSetup);
    d.addEventListener('visibilitychange', rotSync);
    if (hasIO && hero) {
        new IntersectionObserver(function (en) { heroInView = en[0].isIntersecting; rotSync(); }).observe(hero);
    }

    /* ---------------- Scroll-driven: header, progress, parallax, timeline ---------------- */
    var header = $('.site-header');
    var progress = $('#scrollProgress');
    var heroText = $('#heroText');
    var timeline = $('#timeline');
    var tlProgress = $('#timelineProgress');
    var tlItems = $$('.timeline-item');
    var titles = $$('main .section .section-title');
    var ticking = false;
    function onScrollFrame() {
        ticking = false;
        var y = window.scrollY;
        var vh = window.innerHeight;
        var max = Math.max(1, root.scrollHeight - vh);
        if (header) header.classList.toggle('is-scrolled', y > 8);
        if (progress) progress.style.transform = 'scaleX(' + clamp(y / max, 0, 1).toFixed(4) + ')';
        if (!root.classList.contains('fx')) return;
        if (heroText && hero && y < hero.offsetHeight) heroText.style.setProperty('--py', (y * 0.18).toFixed(1) + 'px');
        titles.forEach(function (t) {
            var top = t.parentElement.getBoundingClientRect().top;
            if (top > vh || top < -vh) return;
            t.style.setProperty('--py', clamp(top * 0.06, 0, 36).toFixed(1) + 'px');
        });
        if (timeline && tlProgress) {
            var r = timeline.getBoundingClientRect();
            tlProgress.style.setProperty('--tl', clamp((vh * 0.8 - r.top) / r.height, 0, 1).toFixed(4));
            tlItems.forEach(function (it) { it.classList.toggle('is-lit', it.getBoundingClientRect().top < vh * 0.8); });
        }
    }
    function requestScrollFrame() {
        if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
    }
    window.addEventListener('scroll', requestScrollFrame, { passive: true });
    window.addEventListener('resize', requestScrollFrame, { passive: true });

    /* ---------------- Desktop effects: hero, cursor glow, tilt ---------------- */
    var heroRequested = false;
    function loadHero() {
        if (window.__hero) { window.__hero.enable(); return; }
        if (heroRequested) return;
        heroRequested = true;
        var go = function () {
            var s = d.createElement('script');
            s.src = 'js/hero.js';
            s.async = true;
            d.body.appendChild(s);
        };
        if (d.readyState === 'complete') idle(go);
        else window.addEventListener('load', function () { idle(go); }, { once: true });
    }

    var glow = $('#cursorGlow');
    var gx = 0, gy = 0, glowQueued = false;
    function glowFrame() {
        glowQueued = false;
        glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
    }
    if (glow) {
        d.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse' || !root.classList.contains('fx')) return;
            gx = e.clientX; gy = e.clientY;
            glow.classList.add('is-on');
            if (!glowQueued) { glowQueued = true; requestAnimationFrame(glowFrame); }
        }, { passive: true });
        d.addEventListener('pointerout', function (e) { if (!e.relatedTarget) glow.classList.remove('is-on'); });
    }

    function resetTilt(card) {
        card.classList.remove('is-tilting');
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
    }
    $$('.project-card').forEach(function (card) {
        var queued = false, px = 0.5, py = 0.5;
        function frame() {
            queued = false;
            card.style.setProperty('--ry', ((px - 0.5) * 9).toFixed(2) + 'deg');
            card.style.setProperty('--rx', ((0.5 - py) * 7).toFixed(2) + 'deg');
            card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
            card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        }
        card.addEventListener('pointermove', function (e) {
            if (e.pointerType !== 'mouse' || !root.classList.contains('fx')) return;
            var r = card.getBoundingClientRect();
            px = clamp((e.clientX - r.left) / r.width, 0, 1);
            py = clamp((e.clientY - r.top) / r.height, 0, 1);
            card.classList.add('is-tilting');
            if (!queued) { queued = true; requestAnimationFrame(frame); }
        });
        card.addEventListener('pointerleave', function () { resetTilt(card); });
    });

    function applyFx() {
        var on = mqFx.matches;
        root.classList.toggle('fx', on);
        if (on) {
            loadHero();
        } else {
            if (window.__hero) window.__hero.disable();
            if (glow) glow.classList.remove('is-on');
            $$('.project-card').forEach(resetTilt);
            if (heroText) heroText.style.removeProperty('--py');
            titles.forEach(function (t) { t.style.removeProperty('--py'); });
        }
        requestScrollFrame();
    }
    onMq(mqFx, applyFx);
    applyFx();

    /* ---------------- Focus trap helper ---------------- */
    function trapTab(container, e) {
        if (e.key !== 'Tab') return;
        var f = $$('a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])', container)
            .filter(function (el) { return el.getClientRects().length > 0; });
        if (!f.length) { e.preventDefault(); return; }
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && (d.activeElement === first || !container.contains(d.activeElement))) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && (d.activeElement === last || !container.contains(d.activeElement))) { e.preventDefault(); first.focus(); }
    }

    /* ---------------- Projects: config buttons, filter, dialog ---------------- */
    var grid = $('#projectsGrid');
    var cards = grid ? $$('.project', grid) : [];

    function demoLabel(key) {
        var l = (cfg.demoLabels || {})[key];
        return typeof l === 'string' && l.trim() ? l.trim() : 'Watch demo';
    }
    cards.forEach(function (card) {
        var key = card.getAttribute('data-key');
        var linksBox = $('.project-links', card);
        var openBtn = $('.project-open', card);
        var title = $('.card-title', card).textContent;
        var repo = safeUrl((cfg.repos || {})[key]);
        if (repo && !$('a[href="' + repo + '"]', linksBox)) {
            var g = d.createElement('a');
            g.className = 'btn btn-small';
            g.href = repo; g.target = '_blank'; g.rel = 'noopener noreferrer';
            g.innerHTML = 'GitHub<span class="visually-hidden"> repository for ' + title + '</span>';
            linksBox.insertBefore(g, openBtn);
        }
        var demo = safeUrl((cfg.demos || {})[key]);
        if (demo) {
            var a = d.createElement('a');
            a.className = 'btn btn-small btn-primary';
            a.href = demo; a.target = '_blank'; a.rel = 'noopener noreferrer';
            a.setAttribute('data-label', demoLabel(key));
            a.innerHTML = demoLabel(key) + '<span class="visually-hidden"> of ' + title + '</span>';
            linksBox.insertBefore(a, linksBox.firstChild);
        }
    });

    // Filter with FLIP reorder animation
    var filterBtns = $$('.filter-chip');
    var filterStatus = $('#filterStatus');
    function applyFilter(f) {
        var first = new Map();
        cards.forEach(function (c) { if (!c.hidden) first.set(c, c.getBoundingClientRect()); });
        var shown = 0;
        cards.forEach(function (c) {
            var show = f === 'all' || c.getAttribute('data-cats').split(' ').indexOf(f) !== -1;
            c.hidden = !show;
            if (show) { shown++; c.classList.add('is-visible'); }
        });
        filterBtns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === f)); });
        if (filterStatus) filterStatus.textContent = 'Showing ' + shown + ' of ' + cards.length + ' projects';
        if (reduced() || !Element.prototype.animate) return;
        cards.forEach(function (c) {
            if (c.hidden) return;
            var r = c.getBoundingClientRect();
            var f0 = first.get(c);
            var ease = 'cubic-bezier(.2,.7,.2,1)';
            if (f0) {
                var dx = f0.left - r.left, dy = f0.top - r.top;
                if (dx || dy) c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }], { duration: 480, easing: ease });
            } else {
                c.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: ease });
            }
        });
    }
    filterBtns.forEach(function (b) {
        b.addEventListener('click', function () { applyFilter(b.getAttribute('data-filter')); });
    });

    // Dialog
    var dlg = $('#projectDialog');
    var pdTitle = $('#pdTitle');
    var pdBody = $('#pdBody');
    var current = null, pushed = false, closingFromPop = false, ignorePop = false;

    function cleanClone(node) {
        var c = node.cloneNode(true);
        if (c.removeAttribute) c.removeAttribute('id');
        $$('[id]', c).forEach(function (el) { el.removeAttribute('id'); });
        return c;
    }
    function sectionLabel(text) {
        var h = d.createElement('h3');
        h.className = 'label';
        h.textContent = text;
        return h;
    }
    function fillDialog(card) {
        var body = $('.project-body', card);
        pdTitle.textContent = $('.card-title', card).textContent;
        pdBody.textContent = '';
        ['.project-sub', '.chips', '.bullets', '.note'].forEach(function (sel) {
            var el = $(sel, body);
            if (el) pdBody.appendChild(cleanClone(el));
        });
        var lb = cleanClone($('.project-links', body));
        $$('.project-open', lb).forEach(function (b) { b.remove(); });
        if (lb.children.length) pdBody.appendChild(lb);

        var fig = $('.project-detail .diagram', card);
        if (fig) {
            var arch = d.createElement('div');
            arch.className = 'pd-section project-detail';
            arch.appendChild(sectionLabel('Architecture'));
            arch.appendChild(cleanClone(fig));
            pdBody.appendChild(arch);
        }
        var demoWrap = d.createElement('div');
        demoWrap.className = 'pd-section';
        demoWrap.appendChild(sectionLabel('Demo'));
        var slot = d.createElement('div');
        slot.className = 'demo-slot';
        var demo = safeUrl((cfg.demos || {})[card.getAttribute('data-key')]);
        if (demo) {
            var p = d.createElement('p');
            p.textContent = 'A demo is available for this project.';
            var a = d.createElement('a');
            a.className = 'btn btn-small btn-primary';
            a.href = demo; a.target = '_blank'; a.rel = 'noopener noreferrer';
            a.textContent = demoLabel(card.getAttribute('data-key'));
            slot.appendChild(p); slot.appendChild(a);
        } else {
            var q = d.createElement('p');
            q.textContent = 'No demo recording is linked yet.';
            slot.appendChild(q);
        }
        demoWrap.appendChild(slot);
        pdBody.appendChild(demoWrap);
    }
    function cardFromHash() {
        var h = decodeURIComponent(location.hash.slice(1));
        if (!/^project-/.test(h)) return null;
        var c = d.getElementById(h);
        return c && c.classList.contains('project') ? c : null;
    }
    function openProject(card, push) {
        if (!dlg || !card) return;
        if (dlg.open && current === card) return;
        if (dlg.open) { closingFromPop = true; dlg.close(); }
        current = card;
        fillDialog(card);
        if (push) { history.pushState({ project: card.id }, '', '#' + card.id); pushed = true; }
        else pushed = false;
        dlg.showModal();
        var closeBtn = $('.modal-close', dlg);
        if (closeBtn) closeBtn.focus();
    }
    if (dlg) {
        dlg.addEventListener('keydown', function (e) { trapTab(dlg, e); });
        dlg.addEventListener('click', function (e) {
            if (e.target === dlg || e.target.closest('[data-close]')) dlg.close();
        });
        dlg.addEventListener('close', function () {
            var card = current;
            if (closingFromPop) {
                closingFromPop = false;
            } else if (card && location.hash === '#' + card.id) {
                if (pushed) { ignorePop = true; history.back(); }
                else history.replaceState(null, '', location.pathname + location.search);
            }
            pushed = false;
            current = null;
            if (card) {
                var btn = $('.project-open', card);
                if (btn && btn.getClientRects().length) btn.focus({ preventScroll: true });
            }
        });
    }
    window.addEventListener('popstate', function () {
        if (ignorePop) { ignorePop = false; return; }
        var card = cardFromHash();
        if (card) openProject(card, false);
        else if (dlg && dlg.open) { closingFromPop = true; dlg.close(); }
    });
    cards.forEach(function (card) {
        card.addEventListener('click', function (e) {
            if (e.target.closest('a')) return;
            var sel = window.getSelection && String(window.getSelection());
            if (sel && !e.target.closest('button')) return;
            openProject(card, true);
        });
    });
    // Deep link on load (e.g. #project-memory-hub)
    var initial = cardFromHash();
    if (initial) openProject(initial, false);

    /* ---------------- Command palette ---------------- */
    var pal = $('#palette');
    var palInput = $('#paletteInput');
    var palList = $('#paletteList');
    var palBtn = $('#paletteBtn');
    var kbdHint = $('#kbdHint');
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    if (kbdHint && isMac) kbdHint.textContent = '⌘ K';

    function openUrl(u) { window.open(u, '_blank', 'noopener,noreferrer'); }
    function goSection(id) {
        var el = d.getElementById(id);
        if (!el) return;
        history.pushState(null, '', '#' + id);
        el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
        if (el.hasAttribute('tabindex')) el.focus({ preventScroll: true });
    }
    function linkHref(sel) { var a = $(sel); return a ? a.href : ''; }
    var GITHUB = linkHref('.hero-actions a[href*="github.com"]');
    var LINKEDIN = linkHref('.hero-actions a[href*="linkedin.com"]');
    var RESUME_MAIL = linkHref('a.resume-request[href^="mailto:"]');

    var items = [];
    links.forEach(function (l) {
        var id = l.getAttribute('href').slice(1);
        items.push({ label: l.textContent.trim(), group: 'Section', kw: id, run: function () { goSection(id); } });
    });
    cards.forEach(function (c) {
        items.push({ label: $('.card-title', c).textContent, group: 'Project', kw: $('.project-sub', c).textContent + ' ' + c.getAttribute('data-cats'), run: function () { openProject(c, true); } });
    });
    cards.forEach(function (c) {
        var t = $('.card-title', c).textContent;
        $$('.project-links a[href^="https://"]', c).forEach(function (a) {
            var isRepo = /github\.com/.test(a.href);
            items.push({ label: t + (isRepo ? ' (GitHub)' : ' (' + (a.getAttribute('data-label') || 'Live demo').toLowerCase() + ')'), group: 'Link', kw: 'project ' + (isRepo ? 'repository source code github' : 'demo app'), run: function () { openUrl(a.href); } });
        });
    });
    $$('.also-built .mini').forEach(function (m) {
        var t = $('.mini-title', m).textContent;
        $$('.mini-links a', m).forEach(function (a) {
            var isRepo = /github\.com/.test(a.href);
            items.push({ label: t + (isRepo ? ' (GitHub)' : ' (live demo)'), group: 'Link', kw: 'also built project ' + (isRepo ? 'repository source code github' : 'demo app'), run: function () { openUrl(a.href); } });
        });
    });
    items.push(
        { label: 'GitHub profile', group: 'Link', kw: 'code repositories source', run: function () { openUrl(GITHUB); } },
        { label: 'LinkedIn', group: 'Link', kw: 'profile network', run: function () { openUrl(LINKEDIN); } },
        { label: 'Copy email address', group: 'Action', kw: 'mail contact', run: function () { copyText(EMAIL); } },
        { label: 'Request my resume', group: 'Action', kw: 'cv resume email request', run: function () { if (RESUME_MAIL) window.location.href = RESUME_MAIL; } },
        { label: 'Toggle light / dark theme', group: 'Action', kw: 'theme dark light mode', run: toggleTheme },
        { label: 'Back to top', group: 'Section', kw: 'home hero top', run: function () { goSection('home'); } }
    );

    function score(q, it) {
        if (!q) return 1;
        var label = it.label.toLowerCase();
        var hay = label + ' ' + (it.kw || '').toLowerCase() + ' ' + it.group.toLowerCase();
        var idx = label.indexOf(q);
        if (idx !== -1) return 1000 - idx + (idx === 0 ? 200 : 0);
        idx = hay.indexOf(q);
        if (idx !== -1) return 500 - idx;
        var s = 0, run = 0, j = 0;
        for (var i = 0; i < hay.length && j < q.length; i++) {
            if (hay[i] === q[j]) {
                j++; run++; s += run * 2;
                if (i === 0 || hay[i - 1] === ' ') s += 6;
            } else run = 0;
        }
        return j === q.length ? s : -1;
    }
    var results = [], active = 0, palReturn = null;
    function renderPalette() {
        var q = palInput.value.trim().toLowerCase();
        results = items.map(function (it, i) { return { it: it, s: score(q, it), i: i }; })
            .filter(function (r) { return r.s >= 0; })
            .sort(function (a, b) { return b.s - a.s || a.i - b.i; })
            .map(function (r) { return r.it; });
        active = 0;
        palList.textContent = '';
        if (!results.length) {
            var empty = d.createElement('li');
            empty.className = 'palette-empty';
            empty.setAttribute('role', 'option');
            empty.setAttribute('aria-disabled', 'true');
            empty.setAttribute('aria-selected', 'false');
            empty.textContent = 'No matches';
            palList.appendChild(empty);
            palInput.removeAttribute('aria-activedescendant');
            return;
        }
        results.forEach(function (it, i) {
            var li = d.createElement('li');
            li.className = 'palette-item';
            li.id = 'pal-opt-' + i;
            li.setAttribute('role', 'option');
            var a = d.createElement('span');
            a.textContent = it.label;
            var g = d.createElement('span');
            g.className = 'pi-group';
            g.textContent = it.group;
            li.appendChild(a); li.appendChild(g);
            li.addEventListener('mousemove', function () { if (active !== i) setActive(i); });
            li.addEventListener('click', function () { runItem(i); });
            palList.appendChild(li);
        });
        setActive(0);
    }
    function setActive(i) {
        var opts = $$('.palette-item', palList);
        if (!opts.length) return;
        active = (i + opts.length) % opts.length;
        opts.forEach(function (o, k) { o.setAttribute('aria-selected', String(k === active)); });
        palInput.setAttribute('aria-activedescendant', opts[active].id);
        opts[active].scrollIntoView({ block: 'nearest' });
    }
    function openPalette() {
        if (!pal || pal.open) return;
        palReturn = d.activeElement;
        palInput.value = '';
        renderPalette();
        pal.showModal();
        palInput.focus();
    }
    var palRestore = true;
    function closePalette(restore) {
        if (!pal || !pal.open) return;
        palRestore = restore;
        pal.close();
    }
    function runItem(i) {
        var it = results[i];
        if (!it) return;
        closePalette(false);
        it.run();
    }
    if (pal) {
        palInput.addEventListener('input', renderPalette);
        palInput.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active - 1); }
            else if (e.key === 'Enter') { e.preventDefault(); runItem(active); }
        });
        pal.addEventListener('keydown', function (e) { trapTab(pal, e); });
        pal.addEventListener('cancel', function () { palRestore = true; });
        pal.addEventListener('close', function () {
            if (palRestore && palReturn && palReturn.focus) palReturn.focus({ preventScroll: true });
            palRestore = true;
        });
        pal.addEventListener('click', function (e) { if (e.target === pal) closePalette(true); });
        if (palBtn) palBtn.addEventListener('click', openPalette);
        d.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === 'k' || e.key === 'K')) {
                e.preventDefault();
                if (pal.open) closePalette(true); else openPalette();
            }
        });
    }

    requestScrollFrame();
})();
