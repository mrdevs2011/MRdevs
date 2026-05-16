// ==================== MRDEV SPLASH SCREEN v2.0 ====================
// Ilovaga kirganda 2 soniya davomida chiziluvchi logo animatsiyasi
// Theme (light/dark) avtomatik aniqlanadi

(function () {
    'use strict';

    // ─── helpers ───────────────────────────────────────────────────
    function waitAnim(el) {
        return new Promise(function (resolve) {
            el.addEventListener('animationend', resolve, { once: true });
        });
    }
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    // ─── SVG yaratish ───────────────────────────────────────────────
    function buildSplash() {
        var uid = 'sp' + Math.random().toString(36).slice(2, 8);

        var wrapper = document.createElement('div');
        wrapper.className = 'mrdev-splash';
        wrapper.id = 'mrdevSplashScreen';

        wrapper.innerHTML =
            '<div class="mrdev-splash-logo">' +
                '<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                        '<linearGradient id="spBg_' + uid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                            '<stop offset="0%" stop-color="#64d2ff"/>' +
                            '<stop offset="100%" stop-color="#1a8fe8"/>' +
                        '</linearGradient>' +
                        '<mask id="spMask_' + uid + '">' +
                            '<rect class="sp-mask-rect" x="0" y="0" width="80" height="80" fill="white"/>' +
                        '</mask>' +
                    '</defs>' +
                    '<circle cx="40" cy="40" r="38" fill="url(#spBg_' + uid + ')"/>' +
                    '<path class="sp-stroke"' +
                        ' fill="none" stroke="white" stroke-width="3.5"' +
                        ' stroke-linejoin="round" stroke-linecap="round"' +
                        ' d="M40,16 L64,62 L52,62 L40,44 L28,62 L16,62 Z"/>' +
                    '<path fill="white" mask="url(#spMask_' + uid + ')"' +
                        ' d="M40,16 L64,62 L52,62 L40,44 L28,62 L16,62 Z"/>' +
                '</svg>' +
            '</div>';

        return wrapper;
    }

    // ─── Animatsiya ketma-ketligi ───────────────────────────────────
    async function runSplash(el) {
        var stroke   = el.querySelector('.sp-stroke');
        var maskRect = el.querySelector('.sp-mask-rect');

        // 1) Kichik pauza (logo pop-in tugasin)
        await sleep(350);

        // 2) Stroke chiziladi
        stroke.classList.add('anim-draw');
        await waitAnim(stroke);

        // 3) Stroke yo'qoladi + fill pastdan ko'tariladi
        stroke.classList.remove('anim-draw');
        stroke.style.strokeDashoffset = '0';
        stroke.style.opacity = '1';
        void stroke.getBoundingClientRect(); // reflow
        stroke.classList.add('anim-fade');
        maskRect.classList.add('anim-rise');
        await waitAnim(maskRect);

        // 4) Splash yashiriladi
        await sleep(120);
        hide(el);
    }

    function hide(el) {
        if (!el) return;
        el.classList.add('hidden');
        setTimeout(function () {
            if (el && el.parentNode) el.remove();
        }, 500);
    }

    // ─── Asosiy ishga tushirish ─────────────────────────────────────
    function init() {
        var splash = buildSplash();
        document.body.prepend(splash);

        // Animatsiyani boshlash
        runSplash(splash);

        // Xavfsizlik: 4 soniyada majburiy yashirish
        setTimeout(function () {
            if (splash && !splash.classList.contains('hidden')) {
                hide(splash);
            }
        }, 4000);
    }

    // DOMContentLoaded kutish
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
