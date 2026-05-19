// ==================== MRDEV APP v7.4 ====================
// BUG FIX v7.4:
//   - email-auth.js import qo'shildi (submitAuthForm, toggleAuthMode window ga berilmagan edi)

import logger from './core/logger.js';
import { initTheme, toggleTheme } from './core/theme.js';
import { initAuth, logout } from './core/auth.js';
import { initSidebar, toggleSidebar, closeSidebar } from './ui/sidebar.js';
import { initTabs, switchTab } from './ui/tabs.js';
import { initSearch } from './ui/search.js';
import { initModals, showModal, closeModal } from './ui/modal.js';
import { initUserMenu } from './ui/user-menu.js';
import { signInWithGoogle } from './features/google-auth.js';
import {
    showMrdevLogin,
    closeMrdevLoginModal,
    submitMrdevId,
    verifyMrdevPass
} from './features/mrdev-login.js';
import {
    showPassNotifications,
    closePassNotifModal
} from './features/pass-notifications.js';
import { showToast } from './core/toast.js';
import { initI18n } from './core/i18n.js';
import { autoDetectLanguage } from './core/geo-lang.js';

// BUG FIX: email-auth.js import qilinmagan edi — submitAuthForm va
// toggleAuthMode window ga hech qachon qo'shilmas edi, login formasi ishlamasdi.
import { submitAuthForm, toggleAuthMode } from './features/email-auth.js';

// ==================== WINDOW EXPORTS ====================
window.toggleTheme           = toggleTheme;
window.toggleSidebar         = toggleSidebar;
window.closeSidebar          = closeSidebar;
window.switchTab             = switchTab;
window.signInWithGoogle      = signInWithGoogle;
window.logout                = logout;
window.showAuthModal         = () => showModal('authModal');
window.closeAuthModal        = () => closeModal('authModal');
window.showMrdevLogin        = showMrdevLogin;
window.closeMrdevLoginModal  = closeMrdevLoginModal;
window.submitMrdevId         = submitMrdevId;
window.verifyMrdevPass       = verifyMrdevPass;
window.showPassNotifications = showPassNotifications;
window.closePassNotifModal   = closePassNotifModal;

// BUG FIX: bu ikki funksiya index.html da chaqiriladi lekin window ga qo'shilmagan edi
window.submitAuthForm = submitAuthForm;
window.toggleAuthMode = toggleAuthMode;

window.toggleUserMenu = function () {
    document.getElementById('userMenu')?.classList.toggle('show');
};
window.closeUserMenu = function () {
    document.getElementById('userMenu')?.classList.remove('show');
};

window.toggleMobileSearch = function () {
    const searchSection = document.getElementById('mobileSearchSection');
    const searchInput   = document.getElementById('searchInput');
    if (!searchSection) return;

    const isOpen = searchSection.classList.contains('show');
    if (isOpen) {
        searchSection.classList.remove('show');
        if (searchInput) { searchInput.blur(); searchInput.value = ''; }
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) clearSearch.style.display = 'none';
    } else {
        searchSection.classList.add('show');
        if (searchInput) setTimeout(() => searchInput.focus(), 400);
    }
};

// ==================== INIT ====================
// BUG FIX v7.5: config.js va firebase-init.js top-level await ishlatadi.
// ES module await ga yetganda brauzer to'xtatib DOMContentLoaded ni yuboradi.
// Shu sababli document.addEventListener('DOMContentLoaded', ...) juda kech
// ro'yxatdan o'tadi va callback hech qachon ishlamaydi → app grid bo'sh qoladi.
// Tuzatish: readyState tekshiruvi orqali event o'tib ketganmi yo'qmi aniqlaymiz.
function initApp() {
    logger.platformStart();

    initI18n();   // Saqlangan tilni bir marta qo'llash — auth dan oldin
    autoDetectLanguage().catch(() => {}); // Barcha foydalanuvchilar uchun GPS/browser-lang detection
    initTheme();
    initAuth();
    initSidebar();
    initTabs();
    initSearch();
    initModals();
    initUserMenu();

    document.addEventListener('click', (e) => {
        const userMenu    = document.getElementById('userMenu');
        const userTrigger = document.getElementById('headerUserTrigger');
        if (
            userMenu?.classList.contains('show') &&
            !userMenu.contains(e.target) &&
            !userTrigger?.contains(e.target)
        ) {
            window.closeUserMenu();
        }
    });

    logger.platformReady();
}

// DOMContentLoaded top-level await tufayli modul yuklanishidan oldin o'tib
// ketgan bo'lishi mumkin — readyState 'loading' bo'lsagina listener qo'shamiz,
// aks holda initApp() ni to'g'ridan-to'g'ri chaqiramiz.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}