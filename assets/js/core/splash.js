// ==================== MRDEV SPLASH v2.1 ====================
// Yumshoq: stroke draw → crossfade → fill rise → overlay fade

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

    /* ─── SVG: optik markaz uchun logo 2px yuqoriga ko'chirilgan ─── */
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
            /* Nozik border: doira ustida yarim shaffof qatlam */
            '<circle cx="40" cy="40" r="38" fill="url(#spG_' + uid + ')"/>' +
            '<circle cx="40" cy="40" r="38" fill="none"' +
              ' stroke="rgba(255,255,255,0.15)" stroke-width="1"/>' +
            /* Optik markaz: logo 2px yuqorida — ko'zga markazda ko'rinadi */
            '<path class="sp-stroke"' +
              ' fill="none" stroke="white" stroke-width="3.5"' +
              ' stroke-linejoin="round" stroke-linecap="round"' +
              ' d="M40,14 L64,60 L52,60 L40,42 L28,60 L16,60 Z"/>' +
            '<path fill="white" mask="url(#spM_' + uid + ')"' +
              ' d="M40,14 L64,60 L52,60 L40,42 L28,60 L16,60 Z"/>' +
            '</svg>' +
            '</div>'
        );
        return el;
    }

    async function run(el) {
        var stroke   = el.querySelector('.sp-stroke');
        var maskRect = el.querySelector('.sp-mask-rect');

        /* 1. Logo pop-in tugashini kut */
        await sleep(380);

        /* 2. Stroke chiziladi */
        stroke.classList.add('anim-draw');
        await onAnimEnd(stroke);

        /* 3. Crossfade: stroke yo'qoladi + fill ko'tariladi — parallel,
              lekin fill birozdan keyin boshlanadi (100ms overlap) */
        stroke.classList.remove('anim-draw');
        stroke.style.cssText += ';stroke-dashoffset:0;opacity:1;';
        void el.offsetHeight; /* reflow — animatsiya qayta boshlansin */

        stroke.classList.add('anim-fade');

        /* fill rise 100ms keyin — chiziq hali ko'rinib turgan paytda */
        await sleep(100);
        maskRect.classList.add('anim-rise');
        await onAnimEnd(maskRect);

        /* 4. Qisqa pauza, keyin overlay yumshoq yo'qoladi */
        await sleep(80);
        el.classList.add('hidden');
        setTimeout(function () {
            if (el.parentNode) el.remove();
        }, 600);
    }

    function init() {
        var splash = buildSplash();
        document.body.prepend(splash);
        run(splash);

        /* Xavfsizlik: 5s dan keyin majburiy yashirish */
        setTimeout(function () {
            if (splash && !splash.classList.contains('hidden')) {
                splash.classList.add('hidden');
            }
        }, 5000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
