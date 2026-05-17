// ==================== MRDEV ANIM-ONCE v1.0 ====================
// Entry animatsiyalar faqat birinchi kirganida ishlaydi.
// Qayta kirganida (tab, back, refresh) — animatsiyasiz.

(function () {
    'use strict';
    var KEY = 'mrdev_visited';
    if (sessionStorage.getItem(KEY)) {
        // Shu sessiyada allaqachon kirilgan — animatsiya yo'q
        document.documentElement.classList.add('no-entry-anim');
    } else {
        sessionStorage.setItem(KEY, '1');
    }
})();
