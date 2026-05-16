// ==================== MRDEV THEME FLASH FIX v2.2 ====================
(function() {
    'use strict';

    // ── Theme ──────────────────────────────────────────────
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    const bgColor = theme === 'dark' ? '#1f1f1f' : '#f8fafd';
    document.documentElement.style.backgroundColor = bgColor;
    document.documentElement.style.setProperty('background-color', bgColor, 'important');

    // ── Language (early apply — DOM ko'rinishidan oldin) ───
    (function applyLangEarly() {
        var saved = localStorage.getItem('mrdev_lang');
        var lang = saved;
        if (!lang) {
            var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
            if (nav.startsWith('ru')) lang = 'ru';
            else if (nav.startsWith('en')) lang = 'en';
            else lang = 'uz';

            if (!saved) {
                var langs = navigator.languages || [];
                for (var i = 0; i < langs.length; i++) {
                    var c = langs[i].toLowerCase();
                    if (c.startsWith('ru')) { lang = 'ru'; break; }
                    if (c.startsWith('en')) { lang = 'en'; break; }
                    if (c.startsWith('uz')) { lang = 'uz'; break; }
                }
            }
        }
        document.documentElement.lang = lang;
        // keyingi script'lar uchun
        window.__mrdev_initial_lang = lang;
    })();

    document.documentElement.style.visibility = 'hidden';

    const style = document.createElement('style');
    style.id = 'flash-fix-style';
    style.textContent = `
        *, *::before, *::after {
            transition: none !important;
            animation: none !important;
        }
    `;
    document.head.appendChild(style);

    function revealPage() {
        const fixStyle = document.getElementById('flash-fix-style');
        if (fixStyle) fixStyle.remove();
        document.documentElement.style.backgroundColor = '';
        document.documentElement.style.removeProperty('background-color');
        document.documentElement.style.visibility = '';
        document.documentElement.style.opacity = '0';
        document.documentElement.style.transition = 'opacity 0.15s ease-out';
        requestAnimationFrame(function() {
            document.documentElement.style.opacity = '1';
        });
        setTimeout(function() {
            document.documentElement.style.transition = '';
            document.documentElement.style.opacity = '';
        }, 200);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', revealPage);
    } else {
        revealPage();
    }
})();
