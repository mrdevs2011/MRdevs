// ==================== MRDEV ANIM-ONCE v1.0 ====================
// Entry animatsiyalar faqat birinchi kirganida ishlaydi.
(function () {
    'use strict';
    if (sessionStorage.getItem('mrdev_visited')) {
        document.documentElement.classList.add('no-entry-anim');
    } else {
        sessionStorage.setItem('mrdev_visited', '1');
    }
})();
