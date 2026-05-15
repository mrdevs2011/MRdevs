// ==================== MRDEV AUTH STATE MANAGER v6.1 ====================
import logger from './logger.js';
import { auth, db } from './firebase-init.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { showToast } from './toast.js';
import { initDropdown } from '../dropdown.js';
import { saveUserMrdevId } from '../notif-pass.js';
import { logoutUser as globalLogout } from './global-settings.js';
import { t } from './i18n.js';
import {
    addOrUpdateAccount,
    getActiveAccount,
    getAllAccounts,
    clearAllAccounts
} from './multi-account.js';

let currentUser = null;

function saveLocalAuth(userData) {
    if (userData) {
        localStorage.setItem('mrdev_local_auth', JSON.stringify({
            uid: userData.uid,
            email: userData.email || '',
            displayName: userData.displayName || 'User',
            photoURL: userData.photoURL || null,
            mrdevId: userData.mrdevId || '',
            provider: userData.provider || 'unknown',
            authType: userData.authType || 'unknown',
            isLoggedIn: true,
            loginTime: Date.now()
        }));
    } else {
        localStorage.removeItem('mrdev_local_auth');
    }
}

function getLocalAuth() {
    try {
        const data = JSON.parse(localStorage.getItem('mrdev_local_auth'));
        if (!data || !data.loginTime) return null;
        const hours = (Date.now() - data.loginTime) / (1000 * 60 * 60);
        if (hours > 168) { localStorage.removeItem('mrdev_local_auth'); return null; }
        return data;
    } catch (e) { return null; }
}

// ==================== SMOOTH UI HELPERS ====================
function fadeShow(el, displayType = 'flex', delay = 0) {
    if (!el) return;
    el.style.display = displayType;
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    el.style.transition = 'none';
    const run = () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        });
        setTimeout(() => {
            el.style.transition = '';
            el.style.opacity = '';
            el.style.transform = '';
        }, 360);
    };
    if (delay > 0) { setTimeout(run, delay); } else { run(); }
}

function fadeHide(el, instant = false) {
    if (!el) return;
    if (instant || el.style.display === 'none' || !el.offsetParent) {
        el.style.display = 'none';
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
        return;
    }
    el.style.transition = 'opacity 0.18s ease, transform 0.18s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateY(-4px)';
    setTimeout(() => {
        el.style.display = 'none';
        el.style.opacity = '';
        el.style.transform = '';
        el.style.transition = '';
    }, 200);
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
}

function setAvatar(id, photoURL, fallback) {
    const el = document.getElementById(id);
    if (!el) return;
    if (photoURL) {
        el.innerHTML = `<img src="${photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`;
    } else {
        el.textContent = fallback || '?';
    }
}

// ==================== LOADING STATE ====================
function setUserLoading(loading) {
    const triggers = [
        document.getElementById('mrdevUserTrigger'),
        document.getElementById('mrdevUserTriggerMini'),
        document.getElementById('headerUserTrigger'),
    ];
    triggers.forEach(el => {
        if (!el) return;
        el.classList.toggle('user-loading', loading);
        if (!loading) el.style.transition = '';
    });
}

// ==================== UI UPDATE ====================
export function updateUIForUser(user) {
    const userMenuHeader = document.getElementById('userMenuHeader');
    const userMenuLogin  = document.getElementById('userMenuLogin');
    const userMenuLogout = document.getElementById('userMenuLogout');
    const notifMenuLink  = document.getElementById('notifMenuLink');

    if (!user) {
        fadeHide(userMenuHeader);
        fadeHide(userMenuLogout);
        fadeHide(notifMenuLink);
        fadeShow(userMenuLogin, 'flex', 80);

        const av = document.getElementById('headerUserAvatar');
        if (av) av.textContent = '?';
        const nm = document.getElementById('headerUserName');
        if (nm) nm.textContent = t('guest');
        return;
    }

    const dn      = user.displayName || user.email?.split('@')[0] || 'User';
    const email   = user.email || '';
    const avatar  = dn.charAt(0).toUpperCase();
    const mrdevId = user.mrdevId || localStorage.getItem('mrdev_user_id') || '';

    logger.auth.currentUser(dn, mrdevId || '(yo\'q)');

    fadeHide(userMenuLogin);
    fadeShow(userMenuHeader, 'flex', 0);
    fadeShow(userMenuLogout, 'flex', 40);
    fadeShow(notifMenuLink,  'flex', 80);

    setText('menuName', dn);
    setText('menuEmail', email);
    setText('menuMrdevId', mrdevId);
    setAvatar('menuAvatar', user.photoURL, avatar);

    const av = document.getElementById('headerUserAvatar');
    if (av) {
        av.innerHTML = user.photoURL
            ? `<img src="${user.photoURL}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
            : avatar;
    }
    const nm = document.getElementById('headerUserName');
    if (nm) nm.textContent = dn;

    const ta = document.querySelector('#mrdevUserTrigger .trigger-avatar');
    const tn = document.querySelector('#mrdevUserTrigger .trigger-name');
    if (ta && tn) {
        ta.innerHTML = user.photoURL ? `<img src="${user.photoURL}" alt="${dn}">` : avatar;
        tn.textContent = dn;
    }
}

export async function logout() {
    try {
        const result = await globalLogout(auth, signOut);
        if (result) {
            clearAllAccounts();
            localStorage.removeItem('mrdev_local_auth');
            localStorage.removeItem('mrdev_user_id');
        }
        logger.auth.logout();
    } catch (error) {
        logger.error.auth(error.message);
        showToast(error.message, 'error');
    }
}

export function initAuth() {
    logger.auth.start('v6.1');

    const hasLocalSession = !!getLocalAuth();
    if (hasLocalSession) setUserLoading(true);

    onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser && firebaseUser.uid) {
            logger.auth.firebaseUser(firebaseUser.email, firebaseUser.uid);
            localStorage.removeItem('mrdev_user_id');
            let mrdevId = '';
            try {
                mrdevId = await saveUserMrdevId(firebaseUser);
                if (mrdevId) {
                    logger.auth.mrdevId(mrdevId);
                    localStorage.setItem('mrdev_user_id', mrdevId);
                } else {
                    logger.auth.mrdevIdNull();
                }
            } catch (e) {
                logger.auth.mrdevIdError(e.message);
            }

            currentUser = {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                photoURL: firebaseUser.photoURL || null,
                mrdevId,
                providerData: firebaseUser.providerData || [],
                isAuthenticated: true
            };

            saveLocalAuth({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: currentUser.displayName,
                photoURL: firebaseUser.photoURL,
                mrdevId,
                provider: firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email',
                authType:  firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email'
            });

            addOrUpdateAccount(currentUser, { mrdevId, provider: firebaseUser.providerData?.[0]?.providerId || 'email' });

            document.dispatchEvent(new CustomEvent('mrdev:new_account', {
                detail: { uid: currentUser.uid, displayName: currentUser.displayName, email: currentUser.email }
            }));

            setUserLoading(false);
            updateUIForUser(currentUser);
            try { initDropdown(currentUser); } catch (e) { logger.error.dropdown(e.message); }

        } else {
            const localAuth = getLocalAuth();
            if (localAuth) {
                logger.localAuth.found(localAuth.email);
                currentUser = {
                    uid: localAuth.uid,
                    email: localAuth.email,
                    displayName: localAuth.displayName,
                    photoURL: localAuth.photoURL,
                    mrdevId: localAuth.mrdevId || localStorage.getItem('mrdev_user_id') || '',
                    providerData: [{ providerId: localAuth.provider || 'mrdev' }],
                    isAuthenticated: true
                };
                setUserLoading(false);
                updateUIForUser(currentUser);
                try { initDropdown(currentUser); } catch (e) { logger.error.dropdown(e.message); }
            } else {
                setUserLoading(false);
                currentUser = null;
                updateUIForUser(null);
            }
        }
    });
}
