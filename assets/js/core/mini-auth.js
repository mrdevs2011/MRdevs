// ==================== MRDEV MINI APP AUTH HELPER v2.0 ====================
// Mini applarda foydalanuvchini aniqlash uchun yagona modul.
// Firebase auth + localStorage fallback + timeout himoyasi.

import { auth }             from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { initMiniDropdown, setTriggerLoading } from '../dropdown.js';

/**
 * Mini app da foydalanuvchini aniqlaydi va dropdown ni ishga tushiradi.
 * Firebase null qaytarganda localStorage ga murojaat qiladi.
 * Trigger elementiga setTriggerLoading ni avtomatik qo'llaydi.
 *
 * @param {string} triggerId - 'mrdevUserTriggerMini' yoki boshqa id
 */
export function initMiniAuth(triggerId = 'mrdevUserTriggerMini') {
    const trigger = document.getElementById(triggerId);

    // Agar Firebase 3 soniyadan keyin ham javob bermasa, localStoragega qaraymiz
    const fallbackTimer = setTimeout(() => {
        const localUser = getMiniUserFromLocalStorage();
        if (!window._miniDropdownInited) {
            window._miniDropdownInited = true;
            window.currentUser = localUser;
            initMiniDropdown(localUser);
        }
    }, 3000);

    onAuthStateChanged(auth, (firebaseUser) => {
        // Firebase javob berdi — timerni bekor qilamiz
        clearTimeout(fallbackTimer);

        if (firebaseUser) {
            // ✅ Firebase autentifikatsiya qilgan — eng ishonchli manba
            const mrdevId = localStorage.getItem('mrdev_user_id') || '';
            const user = {
                uid:             firebaseUser.uid,
                email:           firebaseUser.email,
                displayName:     firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                photoURL:        firebaseUser.photoURL || null,
                mrdevId:         mrdevId,
                isAuthenticated: true
            };
            window.currentUser = user;

            if (!window._miniDropdownInited) {
                window._miniDropdownInited = true;
                initMiniDropdown(user);
            } else {
                // Dropdown allaqachon inited — faqat UI ni yangilaymiz
                _updateMiniTrigger(trigger, user);
            }

        } else {
            // Firebase null qaytardi — localStorage dan tekshiramiz
            const localUser = getMiniUserFromLocalStorage();

            if (localUser) {
                window.currentUser = localUser;
                if (!window._miniDropdownInited) {
                    window._miniDropdownInited = true;
                    initMiniDropdown(localUser);
                }
            } else {
                // Haqiqatan mehmon
                window.currentUser = null;
                if (!window._miniDropdownInited) {
                    window._miniDropdownInited = true;
                    initMiniDropdown(null);
                }
            }
        }
    });
}

/**
 * mrdev_local_auth localStorage kalitidan foydalanuvchi ob'ektini qaytaradi.
 * @returns {object|null}
 */
export function getMiniUserFromLocalStorage() {
    try {
        const raw = localStorage.getItem('mrdev_local_auth');
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data?.isLoggedIn || !data?.uid || !data?.email) return null;
        const ageDays = (Date.now() - (data.loginTime || 0)) / (1000 * 60 * 60 * 24);
        if (ageDays > 7) return null;
        return {
            uid:             data.uid,
            email:           data.email,
            displayName:     data.displayName || data.email.split('@')[0] || 'User',
            photoURL:        data.photoURL || null,
            mrdevId:         data.mrdevId || localStorage.getItem('mrdev_user_id') || '',
            isAuthenticated: true
        };
    } catch (e) {
        return null;
    }
}

function _updateMiniTrigger(trigger, user) {
    if (!trigger || !user) return;
    const displayName = user.displayName || 'User';
    const tAvatar = trigger.querySelector('.trigger-avatar');
    const tName   = trigger.querySelector('.trigger-name');
    if (tAvatar) {
        tAvatar.innerHTML = user.photoURL
            ? `<img src="${user.photoURL}" alt="${displayName}">`
            : displayName.charAt(0).toUpperCase();
    }
    if (tName) tName.textContent = displayName;
    if (trigger) trigger.classList.remove('is-loading');
}
