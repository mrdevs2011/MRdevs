// ==================== MRDEV LOADING v2.0 ====================
// Logo asosida cheksiz loop animatsiyasi
// Barcha joyda bir xil ishlatish uchun

(function () {
    'use strict';

    // ─── Logo SVG generator ─────────────────────────────────────────
    function makeLogoSVG() {
        var uid = 'ld' + Math.random().toString(36).slice(2, 8);
        return (
            '<svg class="mrdev-loading-logo" viewBox="0 0 52 52" xmlns="http://www.w3.org/2000/svg">' +
                '<defs>' +
                    '<linearGradient id="ldBg_' + uid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                        '<stop offset="0%" stop-color="#64d2ff"/>' +
                        '<stop offset="100%" stop-color="#1a8fe8"/>' +
                    '</linearGradient>' +
                    '<mask id="ldMask_' + uid + '">' +
                        '<rect class="ld-mask-rect" x="0" y="0" width="52" height="52" fill="white"/>' +
                    '</mask>' +
                '</defs>' +
                '<circle cx="26" cy="26" r="24" fill="url(#ldBg_' + uid + ')"/>' +
                '<path class="ld-stroke"' +
                    ' fill="none" stroke="white" stroke-width="2.8"' +
                    ' stroke-linejoin="round" stroke-linecap="round"' +
                    ' d="M26,11 L41,37 L33,37 L26,26 L19,37 L11,37 Z"/>' +
                '<path fill="white" mask="url(#ldMask_' + uid + ')"' +
                    ' d="M26,11 L41,37 L33,37 L26,26 L19,37 L11,37 Z"/>' +
            '</svg>'
        );
    }

    // ─── Mini SVG (button ichida) ───────────────────────────────────
    function makeSmallLogoSVG() {
        var uid = 'sm' + Math.random().toString(36).slice(2, 8);
        return (
            '<span class="mrdev-btn-spinner">' +
                '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">' +
                    '<defs>' +
                        '<linearGradient id="smBg_' + uid + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
                            '<stop offset="0%" stop-color="#64d2ff"/>' +
                            '<stop offset="100%" stop-color="#1a8fe8"/>' +
                        '</linearGradient>' +
                        '<mask id="smMask_' + uid + '">' +
                            '<rect class="ld-mask-rect-sm" x="0" y="0" width="20" height="20" fill="white"/>' +
                        '</mask>' +
                    '</defs>' +
                    '<circle cx="10" cy="10" r="9.5" fill="url(#smBg_' + uid + ')"/>' +
                    '<path class="ld-stroke-sm"' +
                        ' fill="none" stroke="white" stroke-width="2"' +
                        ' stroke-linejoin="round" stroke-linecap="round"' +
                        ' d="M10,4 L16,14 L13,14 L10,9 L7,14 L4,14 Z"/>' +
                    '<path fill="white" mask="url(#smMask_' + uid + ')"' +
                        ' d="M10,4 L16,14 L13,14 L10,9 L7,14 L4,14 Z"/>' +
                '</svg>' +
            '</span>'
        );
    }

    // ─── MrdevLoading sinfi ─────────────────────────────────────────
    var MrdevLoading = {
        /**
         * Konteyner ichida loading ko'rsatish
         * @param {string|HTMLElement} container
         */
        show: function (container) {
            var el = typeof container === 'string'
                ? document.querySelector(container)
                : container;
            if (!el) return null;

            this.hide(el);

            var loading = document.createElement('div');
            loading.className = 'mrdev-loading';
            loading.innerHTML = makeLogoSVG();

            var computed = getComputedStyle(el);
            if (computed.position === 'static') {
                el.style.position = 'relative';
            }

            el.appendChild(loading);

            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    loading.classList.add('show');
                });
            });

            return loading;
        },

        /**
         * Loadingni yashirish
         * @param {string|HTMLElement} container
         */
        hide: function (container) {
            var el = typeof container === 'string'
                ? document.querySelector(container)
                : container;
            if (!el) return;

            var loading = el.querySelector('.mrdev-loading');
            if (loading) {
                loading.classList.remove('show');
                setTimeout(function () {
                    if (loading.parentNode) loading.remove();
                }, 300);
            }
        },

        /**
         * Global (butun sahifa) loading
         */
        showGlobal: function () {
            return this.show(document.body);
        },

        hideGlobal: function () {
            this.hide(document.body);
        },

        /**
         * Button ichida mini spinner ko'rsatish
         * @param {HTMLElement} btn
         * @param {string} [label] — yuklanayotgan matn (ixtiyoriy)
         */
        showBtn: function (btn, label) {
            if (!btn || btn.dataset.ldActive) return;
            btn.dataset.ldActive = '1';
            btn.dataset.ldOrigHtml = btn.innerHTML;
            btn.disabled = true;
            btn.style.opacity = '0.85';

            var text = label || '';
            btn.innerHTML = makeSmallLogoSVG() +
                (text ? '<span style="margin-left:8px;">' + text + '</span>' : '');
        },

        /**
         * Button loadingini to'xtatish
         * @param {HTMLElement} btn
         */
        hideBtn: function (btn) {
            if (!btn) return;
            delete btn.dataset.ldActive;
            if (btn.dataset.ldOrigHtml !== undefined) {
                btn.innerHTML = btn.dataset.ldOrigHtml;
                delete btn.dataset.ldOrigHtml;
            }
            btn.disabled = false;
            btn.style.opacity = '';
        }
    };

    window.MrdevLoading = MrdevLoading;
})();
