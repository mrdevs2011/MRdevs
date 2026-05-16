// ==================== SETTINGS PAGE SCRIPT v2.1 ====================
// Barcha importlar to'g'ri, initGlobalSettings() chaqiriladi

import { auth } from '../assets/js/core/firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
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

let currentUser = null;

// ==================== UI YANGILASH ====================

function updateUserUI() {
    const userName = document.getElementById('userName');
    const userAvatar = document.getElementById('userAvatar');
    if (!userName || !userAvatar) return;

    if (currentUser) {
        const name = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
        userName.textContent = name;
        if (currentUser.photoURL) {
            userAvatar.innerHTML = `<img src="${currentUser.photoURL}" alt="${name}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;">`;
        } else {
            userAvatar.textContent = name.charAt(0).toUpperCase();
        }
    } else {
        userName.textContent = t('guest');
        userAvatar.textContent = '?';
    }
}

function updateCacheSize() {
    const cacheSize = getCacheSize();
    const cacheEl = document.getElementById('cacheSize');
    if (cacheEl) {
        cacheEl.textContent = `${cacheSize.kb} KB ${t('cache_desc')}`;
    }
}

function loadSettings() {
    // Theme toggle holati
    const theme = getTheme();
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (theme === 'dark') {
            themeToggle.classList.add('active');
        } else {
            themeToggle.classList.remove('active');
        }
    }

    // Notification toggle holati
    const notifications = getNotificationsEnabled();
    const notifToggle = document.getElementById('notifToggle');
    if (notifToggle) {
        if (notifications) {
            notifToggle.classList.add('active');
        } else {
            notifToggle.classList.remove('active');
        }
    }

    // Aktiv til tugmasi
    const lang = getCurrentLang();
    document.querySelectorAll('.lang-option').forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// ==================== EVENT LISTENERS ====================

function initEventListeners() {
    // --- THEME TOGGLE ---
    const themeToggle = document.getElementById('themeToggle');
    themeToggle?.addEventListener('click', () => {
        toggleTheme();
        loadSettings(); // toggle holatini yangilash
    });

    // --- NOTIFICATION TOGGLE ---
    const notifToggle = document.getElementById('notifToggle');
    notifToggle?.addEventListener('click', () => {
        const isActive = notifToggle.classList.contains('active');
        setNotificationsEnabled(!isActive);
        loadSettings();
    });

    // --- TIL O'ZGARTIRISH ---
    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang); // Bu ichida 'languageChanged' event dispatch qiladi
            // initI18n() ni chaqirish shart emas - i18n.js o'zi 'languageChanged' ni tinglaydi
            loadSettings();       // Til tugmalarini yangilash
            updateUserUI();       // Foydalanuvchi ma'lumotini yangilash
            updateCacheSize();    // Kesh hajmini yangilash
        });
    });

    // --- KESH TOZALASH ---
    const clearBtn = document.getElementById('clearCacheBtn');
    clearBtn?.addEventListener('click', () => {
        clearCache(); // Ichida showToast chaqiriladi
        updateCacheSize();
    });

    // --- LOYIHA HAQIDA ---
    const aboutBtn = document.getElementById('aboutBtn');
    aboutBtn?.addEventListener('click', () => {
        window.location.href = '../about/';
    });

    // --- HISOBDAN CHIQISH ---
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn?.addEventListener('click', async () => {
        if (confirm(t('logout_confirm'))) {
            try {
                if (auth?.currentUser) {
                    await signOut(auth);
                }
                localStorage.removeItem('mrdev_local_auth');
                localStorage.removeItem('mrdev_auth_user');
                window.location.href = '../';
            } catch (e) {
                showToast(e.message, 'error');
            }
        }
    });

    // --- TIL O'ZGARGANDA SETTINGS UI YANGILASH ---
    document.addEventListener('languageChanged', () => {
        loadSettings();
        updateUserUI();
        updateCacheSize();
    });

    // --- THEME O'ZGARGANDA SETTINGS UI YANGILASH ---
    document.addEventListener('themeChanged', () => {
        loadSettings();
    });
}

// ==================== ISHGA TUSHIRISH ====================

// 1. Global sozlamalarni boshlang'ich holga keltirish
//    (theme qo'llash + DOM tarjimalar)
initGlobalSettings();

// 2. Settings UI ni yuklash
loadSettings();

// 3. Kesh hajmini ko'rsatish
updateCacheSize();

// 4. Event listener'larni ulash
initEventListeners();

// 5. Firebase auth holati kuzatish
onAuthStateChanged(auth, (user) => {
    currentUser = user;
    updateUserUI();
});