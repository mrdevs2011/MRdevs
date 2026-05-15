// ==================== MRDEV GLOBAL SETTINGS v2.1 ====================
// Barcha sozlamalarni markaziy boshqarish
// logger.js import o'chirildi - to'g'ridan-to'g'ri ishlaydi

import { t, setLanguage, getCurrentLang, initI18n } from './i18n.js';
import { showToast } from './toast.js';

// ==================== THEME ====================
export function getTheme() {
    return localStorage.getItem('mrdev_theme') || localStorage.getItem('theme') || 'light';
}

export function setTheme(isDark) {
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('mrdev_theme', theme);
    localStorage.setItem('theme', theme); // legacy support
    if (isDark) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
}

export function toggleTheme() {
    const isDark = !document.body.classList.contains('dark');
    setTheme(isDark);
    return isDark;
}

// ==================== NOTIFICATIONS ====================
export function getNotificationsEnabled() {
    return localStorage.getItem('mrdev_notifications') !== 'false';
}

export function setNotificationsEnabled(enabled) {
    localStorage.setItem('mrdev_notifications', String(enabled));
    document.dispatchEvent(new CustomEvent('notificationsChanged', { detail: { enabled } }));
}

export function toggleNotifications() {
    const enabled = !getNotificationsEnabled();
    setNotificationsEnabled(enabled);
    return enabled;
}

// ==================== LANGUAGE ====================
export function getLanguage() {
    return getCurrentLang();
}

export function setLanguageGlobal(lang) {
    if (setLanguage(lang)) {
        // setLanguage ichida allaqachon 'languageChanged' event dispatch qilinadi
        return true;
    }
    return false;
}

// ==================== CACHE ====================
export function getCacheSize() {
    let total = 0;
    const excludeKeys = [
        'mrdev_theme', 'mrdev_notifications', 'mrdev_lang',
        'mrdev_user_id', 'mrdev_local_auth', 'mrdev_auth_user',
        'theme', 'mrdev_last_sync'
    ];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !excludeKeys.includes(key)) {
            const val = localStorage.getItem(key);
            if (val) total += val.length * 2;
        }
    }
    return { bytes: total, kb: (total / 1024).toFixed(1) };
}

export function clearCache() {
    const excludeKeys = [
        'mrdev_theme', 'mrdev_notifications', 'mrdev_lang',
        'mrdev_user_id', 'mrdev_local_auth', 'mrdev_auth_user',
        'theme', 'mrdev_last_sync'
    ];
    const toRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !excludeKeys.includes(key)) {
            toRemove.push(key);
        }
    }
    toRemove.forEach(key => localStorage.removeItem(key));
    localStorage.setItem('mrdev_last_sync', Date.now().toString());
    document.dispatchEvent(new CustomEvent('cacheCleared'));
    showToast(t('cleared'), 'success');
    return toRemove.length;
}

// ==================== LOGOUT ====================
export async function logoutUser(auth, signOutFn) {
    try {
        if (auth && auth.currentUser && signOutFn) {
            await signOutFn(auth);
        }
        localStorage.removeItem('mrdev_local_auth');
        localStorage.removeItem('mrdev_auth_user');
        localStorage.removeItem('mrdev_user_id');
        localStorage.removeItem('mrdev_accounts');
        localStorage.removeItem('mrdev_active_account');
        localStorage.removeItem('mrdev_last_sync');
        localStorage.removeItem('mrdev_debug');
        document.dispatchEvent(new CustomEvent('userLoggedOut'));
        showToast(t('logout_success'), 'info');
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
        return true;
    } catch (error) {
        showToast(error.message, 'error');
        return false;
    }
}

// ==================== INIT ====================
/**
 * Global sozlamalarni boshlang'ich holga keltirish:
 * - Saqlangan themeni qo'llaydi
 * - DOM elementlarini tarjima qiladi
 */
export function initGlobalSettings() {
    // 1. Themeni qo'llash
    const savedTheme = getTheme();
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }

    // 2. DOM tarjimalarini yangilash (i18n.initI18n() bilan bir xil)
    initI18n();
}

// ==================== GLOBAL WINDOW EXPORT ====================
window.mrdevSettings = {
    getTheme, setTheme, toggleTheme,
    getNotificationsEnabled, setNotificationsEnabled, toggleNotifications,
    getLanguage, setLanguageGlobal,
    getCacheSize, clearCache,
    logoutUser,
    initGlobalSettings
};