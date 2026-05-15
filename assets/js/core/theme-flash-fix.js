// ==================== MRDEV THEME FLASH FIX v2.2 ====================
(function() {
    'use strict';

    const theme = localStorage.getItem('mrdev_theme') || localStorage.getItem('theme') || 'dark';

    if (theme === 'dark') {
        document.body
            ? document.body.classList.add('dark')
            : document.documentElement.classList.add('dark'); // body henuz yo'q bo'lsa
    }

    const bgColor = theme === 'dark' ? '#1f1f1f' : '#f8fafd';
    document.documentElement.style.backgroundColor = bgColor;

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
        // body mavjud bo'lganda .dark ni body ga ko'chirish
        const t = localStorage.getItem('mrdev_theme') || localStorage.getItem('theme') || 'dark';
        if (t === 'dark') {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
        document.documentElement.classList.remove('dark');

        const fixStyle = document.getElementById('flash-fix-style');
        if (fixStyle) fixStyle.remove();

        document.documentElement.style.backgroundColor = '';
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
