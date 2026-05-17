// ==================== MRDEV SPLASH v3.0 ====================
// Tamoman tabiiy: spring pop → ripple → stroke draw → silk fill → float away

(function () {
    'use strict';

    function sleep(ms) {
        return new Promise(function (r) { setTimeout(r, ms); });
    }
    function onAnimEnd(el) {
        return new Promise(function (r) {
            el.addEventListener('animationend', r, { once: true });
        });
    }

    function buildSplash() {
        var uid = 'sp' + Math.random().toString(36).slice(2, 7);

        var el = document.createElement('div');
        el.className = 'mrdev-splash';
        el.id = 'mrdevSplash';

        el.innerHTML = (
            '<div class="mrdev-splash-logo">' +
            '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' +
              '<linearGradient id="spG_' + uid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#64d2ff"/>' +
                '<stop offset="100%" stop-color="#1a8fe8"/>' +
              '</linearGradient>' +
              '<mask id="spM_' + uid + '">' +
                '<rect class="sp-mask-rect" x="0" y="0" width="80" height="80" fill="white"/>' +
              '</mask>' +
            '</defs>' +
            /* Gradient doira */
            '<circle cx="40" cy="40" r="38" fill="url(#spG_' + uid + ')"/>' +
            /* Nozik inner border */
            '<circle cx="40" cy="40" r="38" fill="none"' +
              ' stroke="rgba(255,255,255,0.18)" stroke-width="1"/>' +
            /* Stroke (chiziluvchi) path */
            '<path class="sp-stroke"' +
              ' fill="none" stroke="white" stroke-width="3.5"' +
              ' stroke-linejoin="round" stroke-linecap="round"' +
              ' d="M40,14 L64,60 L52,60 L40,42 L28,60 L16,60 Z"/>' +
            /* Fill (maskdagi) path */
            '<path fill="white" mask="url(#spM_' + uid + ')"' +
              ' d="M40,14 L64,60 L52,60 L40,42 L28,60 L16,60 Z"/>' +
            '</svg>' +
            '</div>'
        );
        return el;
    }

    async function run(el) {
        var logo    = el.querySelector('.mrdev-splash-logo');
        var stroke  = el.querySelector('.sp-stroke');
        var maskRect = el.querySelector('.sp-mask-rect');

        /* 1. Logo spring pop-in tugashini kut (animation duration: 0.75s) */
        await sleep(400);

        /* 2. Stroke chiziladi */
        stroke.classList.add('anim-draw');
        await onAnimEnd(stroke);

        /* 3. Parallel: stroke yo'qoladi + fill ko'tariladi */
        stroke.classList.remove('anim-draw');
        stroke.style.cssText += ';stroke-dashoffset:0;opacity:1;';
        void el.offsetHeight; /* reflow */

        stroke.classList.add('anim-fade');

        /* Fill 90ms keyin boshlanadi — stroke hali ko'rinib turishida */
        await sleep(90);
        maskRect.classList.add('anim-rise');
        await onAnimEnd(maskRect);

        /* 4. Logoga "done" class — glow pulse */
        logo.classList.add('done');

        /* 5. Qisqa to'xtash, keyin overlay suzib ketadi */
        await sleep(110);
        el.classList.add('hidden');

        setTimeout(function () {
            if (el.parentNode) el.remove();
        }, 700);
    }

    function init() {
        var splash = buildSplash();
        document.body.prepend(splash);
        run(splash);

        /* Xavfsizlik: 5.5s dan keyin majburiy yashirish */
        setTimeout(function () {
            if (splash && !splash.classList.contains('hidden')) {
                splash.classList.add('hidden');
            }
        }, 5500);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
