// ==================== MRDEV LOADING v2.1 ====================
// Yumshoq loop logo animatsiyasi — konteyner overlay + button mini spinner

(function () {
    'use strict';

    /* ─── 52×52 logo SVG ─── */
    function makeLogo() {
        var uid = 'ld' + Math.random().toString(36).slice(2, 7);
        return (
            '<svg class="mrdev-loading-logo" viewBox="0 0 52 52"' +
            ' xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' +
              '<linearGradient id="ldG_' + uid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#64d2ff"/>' +
                '<stop offset="100%" stop-color="#1a8fe8"/>' +
              '</linearGradient>' +
              '<mask id="ldM_' + uid + '">' +
                '<rect class="ld-mask-rect" x="0" y="0" width="52" height="52" fill="white"/>' +
              '</mask>' +
            '</defs>' +
            /* Asosiy doira */
            '<circle cx="26" cy="26" r="24" fill="url(#ldG_' + uid + ')"/>' +
            /* Nozik border */
            '<circle cx="26" cy="26" r="24" fill="none"' +
              ' stroke="rgba(255,255,255,0.14)" stroke-width="0.75"/>' +
            /* Optik markaz: A shakli 1.5px yuqorida */
            '<path class="ld-stroke"' +
              ' fill="none" stroke="white" stroke-width="2.8"' +
              ' stroke-linejoin="round" stroke-linecap="round"' +
              ' d="M26,10 L41,36 L33,36 L26,25 L19,36 L11,36 Z"/>' +
            '<path fill="white" mask="url(#ldM_' + uid + ')"' +
              ' d="M26,10 L41,36 L33,36 L26,25 L19,36 L11,36 Z"/>' +
            '</svg>'
        );
    }

    /* ─── 20×20 mini SVG (button ichida) ─── */
    function makeMiniLogo() {
        var uid = 'sm' + Math.random().toString(36).slice(2, 7);
        return (
            '<span class="mrdev-btn-spinner">' +
            '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
            '<defs>' +
              '<linearGradient id="smG_' + uid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '<stop offset="0%" stop-color="#64d2ff"/>' +
                '<stop offset="100%" stop-color="#1a8fe8"/>' +
              '</linearGradient>' +
              '<mask id="smM_' + uid + '">' +
                '<rect class="ld-mask-rect-sm" x="0" y="0" width="20" height="20" fill="white"/>' +
              '</mask>' +
            '</defs>' +
            '<circle cx="10" cy="10" r="9.2" fill="url(#smG_' + uid + ')"/>' +
            '<circle cx="10" cy="10" r="9.2" fill="none"' +
              ' stroke="rgba(255,255,255,0.14)" stroke-width="0.5"/>' +
            /* Optik markaz: 1px yuqorida */
            '<path class="ld-stroke-sm"' +
              ' fill="none" stroke="white" stroke-width="2"' +
              ' stroke-linejoin="round" stroke-linecap="round"' +
              ' d="M10,3.5 L15.5,13 L12.5,13 L10,8.5 L7.5,13 L4.5,13 Z"/>' +
            '<path fill="white" mask="url(#smM_' + uid + ')"' +
              ' d="M10,3.5 L15.5,13 L12.5,13 L10,8.5 L7.5,13 L4.5,13 Z"/>' +
            '</svg>' +
            '</span>'
        );
    }

    /* ─── MrdevLoading API ─── */
    var MrdevLoading = {

        show: function (container) {
            var el = typeof container === 'string'
                ? document.querySelector(container) : container;
            if (!el) return null;

            this.hide(el);

            var wrap = document.createElement('div');
            wrap.className = 'mrdev-loading';
            wrap.innerHTML  = makeLogo();

            if (getComputedStyle(el).position === 'static') {
                el.style.position = 'relative';
            }
            el.appendChild(wrap);

            requestAnimationFrame(function () {
                requestAnimationFrame(function () { wrap.classList.add('show'); });
            });
            return wrap;
        },

        hide: function (container) {
            var el = typeof container === 'string'
                ? document.querySelector(container) : container;
            if (!el) return;
            var wrap = el.querySelector('.mrdev-loading');
            if (!wrap) return;
            wrap.classList.remove('show');
            setTimeout(function () {
                if (wrap.parentNode) wrap.remove();
            }, 300);
        },

        showGlobal: function () { return this.show(document.body); },
        hideGlobal: function () { this.hide(document.body); },

        /* Button ichida mini spinner */
        showBtn: function (btn, label) {
            if (!btn || btn.dataset.ldOn) return;
            btn.dataset.ldOn    = '1';
            btn.dataset.ldOrig  = btn.innerHTML;
            btn.disabled        = true;
            btn.style.opacity   = '0.82';
            btn.innerHTML = makeMiniLogo() +
                (label
                    ? '<span style="margin-left:7px;vertical-align:middle;">' + label + '</span>'
                    : '');
        },

        hideBtn: function (btn) {
            if (!btn) return;
            if (btn.dataset.ldOrig !== undefined) btn.innerHTML = btn.dataset.ldOrig;
            delete btn.dataset.ldOn;
            delete btn.dataset.ldOrig;
            btn.disabled      = false;
            btn.style.opacity = '';
        }
    };

    window.MrdevLoading = MrdevLoading;
})();
