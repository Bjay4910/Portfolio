/*
 * Hero: 3D network scene drawn with Canvas 2D and a manual perspective projection.
 * Loaded by main.js only on desktop (>= 768px, fine pointer, no reduced motion).
 * The loop runs only while enabled AND the tab is visible AND the hero is on screen,
 * so the idle page does no per-frame work. devicePixelRatio is capped at 2.
 * window.__heroStats exposes frame counts for verification.
 */
(function () {
    'use strict';

    var canvas = document.getElementById('heroCanvas');
    var hero = document.getElementById('home');
    if (!canvas || !hero || !canvas.getContext) return;
    var ctx = canvas.getContext('2d', { alpha: true });
    var mq = window.matchMedia('(min-width: 768px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

    var stats = window.__heroStats = { frames: 0, running: false, starts: 0, stops: 0 };

    // --- Scene: points in a flattened spherical shell, edges precomputed (rotation keeps distances)
    var N = 120;
    var nodes = [];
    var seed = 7;
    function rand() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
    for (var i = 0; i < N; i++) {
        var th = rand() * Math.PI * 2;
        var ph = Math.acos(2 * rand() - 1);
        var r = 0.55 + 0.45 * Math.cbrt(rand());
        nodes.push({
            x: r * Math.sin(ph) * Math.cos(th) * 1.35,
            y: r * Math.sin(ph) * Math.sin(th) * 0.85,
            z: r * Math.cos(ph),
            pulse: i % 11 === 0 ? rand() * Math.PI * 2 : -1,
            sx: 0, sy: 0, p: 0, depth: 0
        });
    }
    var edges = [];
    var degree = new Array(N).fill(0);
    var cand = [];
    for (var a = 0; a < N; a++) {
        for (var b = a + 1; b < N; b++) {
            var dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y, dz = nodes[a].z - nodes[b].z;
            var dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < 0.42) cand.push([a, b, dist]);
        }
    }
    cand.sort(function (p, q) { return p[2] - q[2]; });
    cand.forEach(function (e) {
        if (degree[e[0]] < 4 && degree[e[1]] < 4) {
            degree[e[0]]++; degree[e[1]]++;
            edges.push({ a: e[0], b: e[1], hot: nodes[e[0]].pulse >= 0 || nodes[e[1]].pulse >= 0 });
        }
    });

    // --- Sizing and colors
    var w = 0, h = 0, dpr = 1;
    function resize() {
        var rect = hero.getBoundingClientRect();
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = Math.max(1, Math.round(rect.width));
        h = Math.max(1, Math.round(rect.height));
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (!running && enabled) draw(performance.now());
    }
    var accent = '94, 234, 212', nodeRgb = '200, 214, 235';
    function readColors() {
        var cs = getComputedStyle(document.documentElement);
        accent = cs.getPropertyValue('--accent-rgb').trim() || accent;
        nodeRgb = cs.getPropertyValue('--node').trim() || nodeRgb;
    }

    // --- Animation state
    var rotY = 0, mx = 0, my = 0, cx = 0, cy = 0, last = 0;
    window.addEventListener('pointermove', function (e) {
        if (!running) return;
        mx = (e.clientX / window.innerWidth) * 2 - 1;
        my = (e.clientY / window.innerHeight) * 2 - 1;
    }, { passive: true });

    function draw(t) {
        cx += (mx - cx) * 0.04;
        cy += (my - cy) * 0.04;
        var ay = rotY + cx * 0.35;
        var ax = 0.28 + cy * 0.18;
        var cY = Math.cos(ay), sY = Math.sin(ay), cX = Math.cos(ax), sX = Math.sin(ax);
        var ox = w > 1100 ? w * 0.66 : w * 0.6;
        var oy = h * 0.47;
        var scale = Math.min(w * 0.42, h * 0.62);
        var cam = 2.8;

        for (var i = 0; i < N; i++) {
            var n = nodes[i];
            var x1 = n.x * cY + n.z * sY;
            var z1 = -n.x * sY + n.z * cY;
            var y1 = n.y * cX - z1 * sX;
            var z2 = n.y * sX + z1 * cX;
            var p = cam / (cam + z2);
            n.sx = ox + x1 * scale * p;
            n.sy = oy + y1 * scale * p;
            n.p = p;
            n.depth = Math.min(1, Math.max(0, (1 - z2) / 2));
        }

        ctx.clearRect(0, 0, w, h);
        ctx.lineWidth = 1;
        for (var k = 0; k < edges.length; k++) {
            var e = edges[k], A = nodes[e.a], B = nodes[e.b];
            var dep = (A.depth + B.depth) / 2;
            ctx.strokeStyle = e.hot
                ? 'rgba(' + accent + ',' + (0.12 + 0.3 * dep).toFixed(3) + ')'
                : 'rgba(' + nodeRgb + ',' + (0.05 + 0.17 * dep).toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(A.sx, A.sy);
            ctx.lineTo(B.sx, B.sy);
            ctx.stroke();
        }
        for (var j = 0; j < N; j++) {
            var m = nodes[j];
            var rad = 0.8 + 2.1 * m.p * (0.4 + m.depth);
            if (m.pulse >= 0) {
                var s = 0.5 + 0.5 * Math.sin(t * 0.0022 + m.pulse);
                ctx.fillStyle = 'rgba(' + accent + ',' + (0.10 + 0.22 * s).toFixed(3) + ')';
                ctx.beginPath();
                ctx.arc(m.sx, m.sy, rad * (3 + 2.5 * s), 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = 'rgba(' + accent + ',' + (0.6 + 0.4 * s).toFixed(3) + ')';
            } else {
                ctx.fillStyle = 'rgba(' + nodeRgb + ',' + (0.25 + 0.55 * m.depth).toFixed(3) + ')';
            }
            ctx.beginPath();
            ctx.arc(m.sx, m.sy, rad, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    var raf = 0, running = false, enabled = false, tabVisible = !document.hidden, inView = true;
    function frame(t) {
        if (!running) return;
        var dt = Math.min(64, t - last);
        last = t;
        rotY += dt * 0.00009;
        draw(t);
        stats.frames++;
        raf = requestAnimationFrame(frame);
    }
    function update() {
        var should = enabled && tabVisible && inView;
        if (should && !running) {
            running = true;
            stats.starts++;
            last = performance.now();
            raf = requestAnimationFrame(frame);
        } else if (!should && running) {
            running = false;
            stats.stops++;
            cancelAnimationFrame(raf);
        }
        stats.running = running;
    }

    document.addEventListener('visibilitychange', function () { tabVisible = !document.hidden; update(); });
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (en) { inView = en[0].isIntersecting; update(); }, { threshold: 0 }).observe(hero);
    }
    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(hero);
    else window.addEventListener('resize', resize);
    window.addEventListener('themechange', function () { readColors(); if (!running && enabled) draw(performance.now()); });

    function enable() {
        if (!mq.matches) return;
        enabled = true;
        readColors();
        hero.classList.add('is-live');
        update();
    }
    function disable() {
        enabled = false;
        hero.classList.remove('is-live');
        update();
    }
    window.__hero = { enable: enable, disable: disable, stats: stats };

    readColors();
    resize();
    if (mq.matches && document.documentElement.classList.contains('fx')) enable();
})();
