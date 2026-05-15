// ==================== SETTINGS PAGE SCRIPT v3.0 ====================
// Bug fix: MRDEV ID login uchun localStorage fallback
// Yangi: Settings dropdown + loading animation

import { auth } from '../assets/js/core/firebase-init.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { showToast } from '../assets/js/core/toast.js';
import { t, setLanguage, getCurrentLang, initI18n } from '../assets/js/core/i18n.js';
import {
    initGlobalSettings,
    getTheme,
    getCacheSize,
    clearCache,
    setNotificationsEnabled,
    getNotificationsEnabled
} from '../assets/js/core/global-settings.js';
import { toggleTheme } from '../assets/js/core/theme.js';

let currentUser   = null;
let _isLoading    = true;
let _dropdownOpen = false;

// ==================== LOCAL AUTH FALLBACK ====================
function getLocalAuth() {
    try {
        const data = JSON.parse(localStorage.getItem('mrdev_local_auth') || 'null');
        if (!data || !data.isLoggedIn || !data.uid) return null;
        const hours = (Date.now() - (data.loginTime || 0)) / 3600000;
        if (hours > 24) return null;
        return data;
    } catch { return null; }
}

// ==================== LOADING STATE ====================
function setLoading(loading) {
    _isLoading = loading;
    const trigger = document.getElementById('settingsUserTrigger');
    if (trigger) trigger.classList.toggle('user-loading', loading);
}

// ==================== USER UI ====================
function updateUserUI() {
    const avatar = document.getElementById('settingsUserAvatar');
    const name   = document.getElementById('settingsUserName');
    setLoading(false);

    if (currentUser) {
        const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        if (avatar) {
            if (currentUser.photoURL) {
                avatar.innerHTML = `<img src="${currentUser.photoURL}" alt="${displayName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
            } else {
                avatar.textContent = displayName.charAt(0).toUpperCase();
            }
        }
        if (name) name.textContent = displayName;
    } else {
        if (avatar) avatar.textContent = '?';
        if (name)   name.textContent   = t('guest');
    }
    updateDropdownProfile();
}

// ==================== DROPDOWN ====================
function buildDropdown() {
    if (document.getElementById('settingsDropdown')) return;
    const html = `
        <div class="su-overlay" id="settingsDropdownOverlay"></div>
        <div class="su-dropdown" id="settingsDropdown">
            <div class="su-profile" id="suProfile">
                <div class="su-profile-avatar" id="suAvatar"></div>
                <div class="su-profile-info">
                    <div class="su-profile-name" id="suName"></div>
                    <div class="su-profile-email" id="suEmail"></div>
                    <div class="su-profile-id" id="suMrdevId"></div>
                </div>
            </div>
            <div class="su-divider"></div>
            <a href="../" class="su-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                Bosh sahifa
            </a>
            <a href="../about/" class="su-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Loyiha haqida
            </a>
            <div class="su-divider"></div>
            <button class="su-item su-danger" id="suLogout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Chiqish
            </button>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', html);
    document.getElementById('settingsDropdownOverlay')?.addEventListener('click', closeDropdown);
    document.getElementById('suLogout')?.addEventListener('click', handleLogout);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && _dropdownOpen) closeDropdown();
    });
    updateDropdownProfile();
}

function updateDropdownProfile() {
    const avatar  = document.getElementById('suAvatar');
    const name    = document.getElementById('suName');
    const email   = document.getElementById('suEmail');
    const mrdevId = document.getElementById('suMrdevId');
    if (!avatar) return;

    if (currentUser) {
        const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        const userId      = currentUser.mrdevId || localStorage.getItem('mrdev_user_id') || '';
        if (currentUser.photoURL) {
            avatar.innerHTML = `<img src="${currentUser.photoURL}" alt="${displayName}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            avatar.textContent = displayName.charAt(0).toUpperCase();
        }
        if (name)    name.textContent    = displayName;
        if (email)   email.textContent   = currentUser.email || '';
        if (mrdevId) {
            mrdevId.textContent     = userId ? 'ID: ' + userId : '';
            mrdevId.style.display   = userId ? 'block' : 'none';
        }
    } else {
        avatar.textContent = '?';
        if (name)    name.textContent  = t('guest');
        if (email)   email.textContent = '';
        if (mrdevId) mrdevId.style.display = 'none';
    }
}

function openDropdown() {
    buildDropdown();
    updateDropdownProfile();
    document.getElementById('settingsDropdown')?.classList.add('show');
    document.getElementById('settingsDropdownOverlay')?.classList.add('show');
    _dropdownOpen = true;
}

function closeDropdown() {
    document.getElementById('settingsDropdown')?.classList.remove('show');
    document.getElementById('settingsDropdownOverlay')?.classList.remove('show');
    _dropdownOpen = false;
}

// ==================== LOGOUT ====================
async function handleLogout() {
    closeDropdown();
    if (!confirm(t('logout_confirm') || 'Hisobdan chiqmoqchimisiz?')) return;
    try {
        if (auth?.currentUser) await signOut(auth);
        localStorage.removeItem('mrdev_local_auth');
        localStorage.removeItem('mrdev_auth_user');
        window.location.href = '../';
    } catch (e) {
        showToast(e.message, 'error');
    }
}

// ==================== CACHE ====================
function updateCacheSize() {
    const sz = getCacheSize();
    const el = document.getElementById('cacheSize');
    if (el) el.textContent = sz.kb + ' KB ' + t('cache_desc');
}

// ==================== SETTINGS TOGGLES ====================
function loadSettings() {
    document.getElementById('themeToggle')?.classList.toggle('active', getTheme() === 'dark');
    document.getElementById('notifToggle')?.classList.toggle('active', getNotificationsEnabled());
    const lang = getCurrentLang();
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// ==================== EVENT LISTENERS ====================
function initEventListeners() {
    document.getElementById('settingsUserTrigger')?.addEventListener('click', (e) => {
        e.stopPropagation();
        _dropdownOpen ? closeDropdown() : openDropdown();
    });

    document.getElementById('themeToggle')?.addEventListener('click', () => {
        toggleTheme(); loadSettings();
    });

    document.getElementById('notifToggle')?.addEventListener('click', () => {
        setNotificationsEnabled(!getNotificationsEnabled()); loadSettings();
    });

    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
            loadSettings(); updateUserUI(); updateCacheSize();
        });
    });

    document.getElementById('clearCacheBtn')?.addEventListener('click', () => {
        clearCache(); updateCacheSize();
    });

    document.getElementById('aboutBtn')?.addEventListener('click', () => {
        window.location.href = '../about/';
    });

    document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);

    document.addEventListener('languageChanged', () => {
        loadSettings(); updateUserUI(); updateCacheSize();
    });
    document.addEventListener('themeChanged', loadSettings);
}

// ==================== AUTH ====================
function initAuth() {
    setLoading(true);

    // MRDEV ID login uchun darhol localStorage dan ko'rsat
    const localAuth = getLocalAuth();
    if (localAuth) {
        currentUser = {
            uid:         localAuth.uid,
            email:       localAuth.email       || '',
            displayName: localAuth.displayName || localAuth.email?.split('@')[0] || 'User',
            photoURL:    localAuth.photoURL    || null,
            mrdevId:     localAuth.mrdevId     || localStorage.getItem('mrdev_user_id') || '',
        };
        updateUserUI();
    }

    // Firebase auth (Google / Email) kuzatish
    onAuthStateChanged(auth, (user) => {
        if (user) {
            currentUser = {
                uid:         user.uid,
                email:       user.email       || '',
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                photoURL:    user.photoURL    || null,
                mrdevId:     localStorage.getItem('mrdev_user_id') || '',
            };
        } else if (!localAuth) {
            currentUser = null;
        }
        updateUserUI();
    });
}

// ==================== INIT ====================
initGlobalSettings();
loadSettings();
updateCacheSize();
initEventListeners();
initAuth();