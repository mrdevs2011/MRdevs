// ==================== SETTINGS PAGE SCRIPT v3.0 ====================
// Settings user dropdown + Firebase devices + skeleton loading

import { auth, db } from '../assets/js/core/firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { showToast } from '../assets/js/core/toast.js';
import { t, setLanguage, getCurrentLang, initI18n } from '../assets/js/core/i18n.js';
import { markLangAsManual, resetManualLang } from '../assets/js/core/geo-lang.js';
import {
    initGlobalSettings,
    getTheme,
    getCacheSize,
    clearCache,
    setNotificationsEnabled,
    getNotificationsEnabled
} from '../assets/js/core/global-settings.js';
import { toggleTheme } from '../assets/js/core/theme.js';
import { initSettingsDropdown, setTriggerLoading } from '../assets/js/dropdown.js';

let currentUser = null;


async function loadDevices(user) {
    const container = document.getElementById('settingsDropDevices');
    if (!container) return;

    container.innerHTML = `<div class="settings-dropdown-empty">${t('loading')}</div>`;

    try {
        // 1. localStorage dan tekshir
        let devices = [];
        const localDevices = localStorage.getItem('mrdev_devices');
        if (localDevices) {
            devices = JSON.parse(localDevices);
        }

        // 2. Firebase dan yuklashga harakat
        if (user.uid && db) {
            try {
                const snap = await getDoc(doc(db, 'users', user.uid));
                if (snap.exists()) {
                    const data = snap.data();
                    if (data.devices && Array.isArray(data.devices)) {
                        devices = data.devices;
                    }
                }
            } catch (e) {
                // Firebase dan yuklanmadi — localdan foydalanamiz
            }
        }

        renderDevices(devices);
    } catch (e) {
        renderDevices([]);
    }
}

function renderDevices(devices) {
    const container = document.getElementById('settingsDropDevices');
    if (!container) return;

    if (!devices || devices.length === 0) {
        container.innerHTML = `<div class="settings-dropdown-empty">${t('connected_device_not_found')}</div>`;
        return;
    }

    const currentDevice = getDeviceInfo();

    container.innerHTML = devices.map(device => {
        const isCurrent = device.id === currentDevice.id || device.userAgent === navigator.userAgent;
        return `
            <div class="settings-dropdown-device ${isCurrent ? 'current' : ''}">
                <div class="settings-device-icon">
                    ${getDeviceIcon(device.type || 'desktop')}
                </div>
                <div class="settings-device-info">
                    <div class="settings-device-name">${escapeHtml(device.name || device.type || t('device_name_default'))}</div>
                    <div class="settings-device-meta">${isCurrent ? t('current_device') : (device.lastSeen ? formatDate(device.lastSeen) : '')}</div>
                </div>
                ${isCurrent ? `<div class="settings-device-badge">${t('active')}</div>` : ''}
            </div>
        `;
    }).join('');
}

function getDeviceInfo() {
    const ua = navigator.userAgent;
    const isMobile  = /Android|iPhone|iPad|iPod/i.test(ua);
    const isTablet  = /iPad|Tablet/i.test(ua);
    return {
        id:        btoa(ua).substring(0, 16),
        type:      isTablet ? 'tablet' : isMobile ? 'mobile' : 'desktop',
        userAgent: ua
    };
}

function getDeviceIcon(type) {
    const icons = {
        mobile:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
        tablet:  `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>`,
        desktop: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
    };
    return icons[type] || icons.desktop;
}

function formatDate(timestamp) {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return d.toLocaleDateString('uz-UZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function escapeHtml(str) {
    const el = document.createElement('div');
    el.textContent = str;
    return el.innerHTML;
}

// ==================== SETTINGS HEADER USER UI ====================

function updateSettingsHeaderUser(user) {
    const avatar   = document.getElementById('userAvatar');
    const userName = document.getElementById('userName');

    if (user) {
        const name = user.displayName || user.email?.split('@')[0] || 'User';
        if (userName) userName.textContent = name;
        if (avatar) {
            avatar.innerHTML = user.photoURL
                ? `<img src="${user.photoURL}" alt="${name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`
                : name.charAt(0).toUpperCase();
        }
    } else {
        if (userName) userName.textContent = t('guest');
        if (avatar)   avatar.textContent   = '?';
    }

    // Skeleton olib tashlash
    const trigger = document.getElementById('headerUserTrigger');
    if (trigger) {
        trigger.classList.remove('is-loading');
        trigger.style.pointerEvents = '';
    }
}

// ==================== CACHE & SETTINGS UI ====================

function updateCacheSize() {
    const cacheSize = getCacheSize();
    const cacheEl   = document.getElementById('cacheSize');
    if (cacheEl) {
        cacheEl.textContent = `${cacheSize.kb} KB ${t('cache_desc')}`;
    }
}

function loadSettings() {
    const theme = getTheme();
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.classList.toggle('active', theme === 'dark');
    }

    const notifications = getNotificationsEnabled();
    const notifToggle   = document.getElementById('notifToggle');
    if (notifToggle) {
        notifToggle.classList.toggle('active', notifications);
    }

    const lang = getCurrentLang();
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// ==================== EVENT LISTENERS ====================

function initEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', () => {
        toggleTheme();
        loadSettings();
    });

    // Notification toggle
    document.getElementById('notifToggle')?.addEventListener('click', () => {
        const isActive = document.getElementById('notifToggle').classList.contains('active');
        setNotificationsEnabled(!isActive);
        loadSettings();
    });

    // Til o'zgartirish
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            markLangAsManual();   // GPS auto-detect endi ishlamaydi
            setLanguage(btn.dataset.lang);
            loadSettings();
            updateCacheSize();
            if (currentUser) updateSettingsHeaderUser(currentUser);
        });
    });

    // Kesh tozalash
    document.getElementById('clearCacheBtn')?.addEventListener('click', () => {
        clearCache();
        resetManualLang();   // Kesh tozalansa GPS til-aniqlash ham qayta ishlaydi
        updateCacheSize();
    });

    // Loyiha haqida
    document.getElementById('aboutBtn')?.addEventListener('click', () => {
        window.location.href = '../about/';
    });

    // Hisobdan chiqish
    document.getElementById('logoutBtn')?.addEventListener('click', async () => {
        if (confirm(t('logout_confirm'))) {
            try {
                if (auth?.currentUser) await signOut(auth);
                localStorage.removeItem('mrdev_local_auth');
                localStorage.removeItem('mrdev_auth_user');
                window.location.href = '../';
            } catch (e) {
                showToast(e.message, 'error');
            }
        }
    });

    // Til o'zgarganda yangilash
    document.addEventListener('languageChanged', () => {
        loadSettings();
        updateCacheSize();
        if (currentUser) updateSettingsHeaderUser(currentUser);
    });

    // Theme o'zgarganda yangilash
    document.addEventListener('themeChanged', () => {
        loadSettings();
    });
}

// ==================== ISHGA TUSHIRISH ====================

// 1. Global sozlamalar
initGlobalSettings();

// 2. Settings UI
loadSettings();

// 3. Kesh hajmi
updateCacheSize();

// 4. Event listeners
initEventListeners();

// 6. Firebase auth holati kuzatish
onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
        const mrdevId = localStorage.getItem('mrdev_user_id') || '';
        currentUser = {
            uid:         firebaseUser.uid,
            email:       firebaseUser.email,
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL:    firebaseUser.photoURL || null,
            mrdevId:     mrdevId,
            isAuthenticated: true
        };
    } else {
        // MRDEV local auth tekshir
        try {
            const local = JSON.parse(localStorage.getItem('mrdev_local_auth') || 'null');
            if (local?.isLoggedIn && local?.uid) {
                const days = (Date.now() - (local.loginTime || 0)) / (1000 * 60 * 60 * 24);
                if (days < 7) {
                    currentUser = {
                        uid:         local.uid,
                        email:       local.email,
                        displayName: local.displayName || 'User',
                        photoURL:    local.photoURL || null,
                        mrdevId:     local.mrdevId || localStorage.getItem('mrdev_user_id') || '',
                        isAuthenticated: true
                    };
                    updateSettingsHeaderUser(currentUser);
                    try { initSettingsDropdown(currentUser); } catch(e) { console.warn('Dropdown:', e.message); }
                    return;
                }
            }
        } catch (e) {}

        currentUser = null;
    }

    updateSettingsHeaderUser(currentUser);
    try { initSettingsDropdown(currentUser); } catch(e) { console.warn('Dropdown:', e.message); }
});