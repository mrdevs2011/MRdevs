// ==================== MRDEV MAIN SCRIPT v9.0 ====================
// window.xxx = function() {} o'rniga EventBus ishlatiladi.
// HTML elementlar data-action="..." orqali hodisa chiqaradi.

import { initTheme, toggleTheme } from './assets/js/core/theme.js';
import { initAuth, logout }        from './assets/js/core/auth.js';
import { initTabs, switchTab }     from './assets/js/ui/tabs.js';
import { initSearch }              from './assets/js/ui/search.js';
import { initModals, showModal, closeModal } from './assets/js/ui/modal.js';
import { initUserMenu }            from './assets/js/ui/user-menu.js';
import { signInWithGoogle }        from './assets/js/features/google-auth.js';
import { showMrdevLogin, closeMrdevLoginModal, submitMrdevId } from './assets/js/features/mrdev-login.js';
import { showPassNotifications, closePassNotifModal } from './assets/js/features/pass-notifications.js';
import { setAuthMode, toggleAuthMode, submitAuthForm, signInWithEmail, signUpWithEmail } from './assets/js/features/email-auth.js';
import { showToast }               from './assets/js/core/toast.js';
import { initI18n }                from './assets/js/core/i18n.js';
import EventBus                    from './assets/js/core/event-bus.js';

// ==================== EVENT BUS HANDLERS ====================
// HTML data-action="..." tugmalar shu yerda bog'lanadi
function registerActions() {
    EventBus.on('toggle-theme',         () => toggleTheme());
    EventBus.on('switch-tab',           (tab) => switchTab(tab));
    EventBus.on('logout',               () => logout());

    // Auth modal
    EventBus.on('show-auth-modal',      () => { setAuthMode('login'); showModal('authModal'); });
    EventBus.on('close-auth-modal',     () => closeModal('authModal'));
    EventBus.on('set-auth-mode',        (mode) => setAuthMode(mode));
    EventBus.on('toggle-auth-mode',     () => toggleAuthMode());
    EventBus.on('submit-auth-form',     () => submitAuthForm());
    EventBus.on('google-login',         () => signInWithGoogle());

    // MRDEV ID
    EventBus.on('show-mrdev-login',     () => showMrdevLogin());
    EventBus.on('close-mrdev-login',    () => closeMrdevLoginModal());
    EventBus.on('submit-mrdev-id',      () => submitMrdevId());

    // Pass notifications
    EventBus.on('show-pass-notif',      () => showPassNotifications());
    EventBus.on('close-pass-notif',     () => closePassNotifModal());

    // User menu
    EventBus.on('toggle-user-menu',     () => document.getElementById('userMenu')?.classList.toggle('show'));
    EventBus.on('close-user-menu',      () => document.getElementById('userMenu')?.classList.remove('show'));

    // Mobile search
    EventBus.on('toggle-mobile-search', () => _toggleMobileSearch());
}

// ==================== LEGACY WINDOW EXPORTS ====================
// Eski HTML fayllar (data-action ga ko'chirilmagan) uchun qoldirildi.
// Yangi ilovalar data-action ishlatsin. Bu qator keyinchalik o'chiriladi.
window.toggleTheme       = toggleTheme;
window.switchTab         = switchTab;
window.signInWithGoogle  = signInWithGoogle;
window.logout            = logout;
window.showAuthModal     = () => { setAuthMode('login'); showModal('authModal'); };
window.closeAuthModal    = () => closeModal('authModal');
window.setAuthMode       = setAuthMode;
window.toggleAuthMode    = toggleAuthMode;
window.submitAuthForm    = submitAuthForm;
window.signInWithEmail   = signInWithEmail;
window.signUpWithEmail   = signUpWithEmail;
window.showMrdevLogin    = showMrdevLogin;
window.closeMrdevLoginModal = closeMrdevLoginModal;
window.submitMrdevId     = submitMrdevId;
window.showPassNotifications = showPassNotifications;
window.closePassNotifModal   = closePassNotifModal;
window.toggleUserMenu    = () => document.getElementById('userMenu')?.classList.toggle('show');
window.closeUserMenu     = () => document.getElementById('userMenu')?.classList.remove('show');
window.toggleMobileSearch = _toggleMobileSearch;

// ==================== YORDAMCHILAR ====================
function _toggleMobileSearch() {
    const section    = document.getElementById('mobileSearchSection');
    const input      = document.getElementById('searchInput');
    const clearBtn   = document.getElementById('clearSearch');
    if (!section) return;
    const isOpen = section.classList.contains('show');
    if (isOpen) {
        section.classList.remove('show');
        if (input)    { input.blur(); input.value = ''; }
        if (clearBtn)  clearBtn.style.display = 'none';
    } else {
        section.classList.add('show');
        if (input) setTimeout(() => input.focus(), 400);
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
    // i18n birinchi — sahifa tarjima qilinsin
    await initI18n();

    initTheme();
    initAuth();
    initTabs();
    initSearch();
    initModals();
    initUserMenu();

    // EventBus ulash
    registerActions();
    EventBus.bindDataActions();

    // Click outside — userMenu yopilishi
    document.addEventListener('click', (e) => {
        const userMenu   = document.getElementById('userMenu');
        const userTrigger = document.getElementById('headerUserTrigger');
        if (userMenu?.classList.contains('show') &&
            !userMenu.contains(e.target) &&
            !userTrigger?.contains(e.target)) {
            EventBus.emit('close-user-menu');
        }
    });
});