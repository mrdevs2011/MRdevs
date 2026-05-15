// ==================== MRDEV APP SHELL v1.0 ====================
// Mini va popular ilovalar uchun umumiy asos.
// Har bir ilovada takror-takror yoziladigan:
//   - Auth tekshirish
//   - Theme initialization
//   - i18n initialization
//   - Toast
//   - Back button
// shu bir fayldan boshqariladi.
//
// Ishlatish:
//   import { initAppShell } from '../../assets/js/core/app-shell.js';
//   initAppShell({ requireAuth: true, appName: 'notes' });

import { initTheme }   from './theme.js';
import { initI18n, t } from './i18n.js';
import { showToast }    from './toast.js';
import { auth }         from './firebase-init.js';
import { onAuthStateChanged } from 'firebase/auth';

/**
 * @typedef {Object} AppShellOptions
 * @property {boolean} [requireAuth=true]   - false bo'lsa, login talab qilinmaydi
 * @property {string}  [appName='']         - ilova nomi (log va title uchun)
 * @property {Function}[onAuth]             - foydalanuvchi aniqlananda chaqiriladi (user) => void
 * @property {Function}[onNoAuth]           - login yo'q bo'lganda chaqiriladi () => void
 * @property {string}  [redirectOnNoAuth]   - login yo'q bo'lsa yo'naltiriladigan URL
 */

/**
 * Ilovani ishga tushiradi.
 * @param {AppShellOptions} options
 * @returns {Promise<void>}
 */
export async function initAppShell(options = {}) {
    const {
        requireAuth       = true,
        appName           = '',
        onAuth            = null,
        onNoAuth          = null,
        redirectOnNoAuth  = null,
    } = options;

    // 1. Theme (flash oldini olish uchun birinchi)
    initTheme();

    // 2. i18n (asinxron — JSON yuklaydi)
    await initI18n();

    // 3. Back tugmasi
    _initBackButton();

    // 4. Auth holati
    if (requireAuth) {
        await _waitForAuth({
            onAuth,
            onNoAuth,
            redirectOnNoAuth,
            appName,
        });
    } else {
        // Auth talab qilinmasa ham, optional callback
        onAuthStateChanged(auth, (user) => {
            if (user && typeof onAuth === 'function') onAuth(user);
        });
    }
}

// ==================== ICHKI YORDAMCHILAR ====================

function _initBackButton() {
    const backBtn = document.getElementById('backBtn');
    if (!backBtn) return;
    backBtn.addEventListener('click', () => {
        // index.html ga qaytish
        const depth = window.location.pathname.split('/').filter(Boolean).length;
        const backPath = depth > 1 ? '../'.repeat(depth - 1) : '/';
        window.location.href = backPath;
    });
}

function _waitForAuth({ onAuth, onNoAuth, redirectOnNoAuth, appName }) {
    return new Promise((resolve) => {
        // localStorage da quick-check: agar login yo'q bo'lsa, Firebase javobini kutmasdan redirect
        const localAuth = _getLocalAuth();
        let resolved = false;

        const unsub = onAuthStateChanged(auth, (user) => {
            if (resolved) return;

            if (user) {
                resolved = true;
                unsub();
                if (typeof onAuth === 'function') onAuth(user);
                resolve(user);
            } else if (!localAuth) {
                // Firebase ham, localStorage ham — login yo'q
                resolved = true;
                unsub();
                if (redirectOnNoAuth) {
                    window.location.href = redirectOnNoAuth;
                } else if (typeof onNoAuth === 'function') {
                    onNoAuth();
                } else {
                    showToast(t('login_required'), 'warning');
                }
                resolve(null);
            }
            // Agar localAuth bor lekin Firebase hali yuklamagan — kutamiz
        });

        // 5 soniya kutib Firebase javob bermasa — timeout
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                unsub();
                if (localAuth) {
                    // localStorage dan synthetic user
                    if (typeof onAuth === 'function') onAuth(localAuth);
                    resolve(localAuth);
                } else {
                    resolve(null);
                }
            }
        }, 5000);
    });
}

function _getLocalAuth() {
    try {
        const data = JSON.parse(localStorage.getItem('mrdev_local_auth'));
        if (!data?.loginTime) return null;
        const hours = (Date.now() - data.loginTime) / 3_600_000;
        return hours < 24 ? data : null;
    } catch {
        return null;
    }
}

// ==================== RE-EXPORT FOYDALI FUNKSIYALAR ====================
// Ilovalar bu bir fayldan hamma keraklarini import qilsin
export { showToast } from './toast.js';
export { t, setLanguage, getCurrentLang } from './i18n.js';
export { initTheme, toggleTheme } from './theme.js';
