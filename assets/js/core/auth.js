// ==================== MRDEV AUTH STATE MANAGER v6.0 ====================
import logger from './logger.js';
import { auth, db } from './firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { showToast } from './toast.js';
import { initDropdown } from '../dropdown.js';
import { saveUserMrdevId } from '../notif-pass.js';
import { logoutUser as globalLogout, clearCache } from './global-settings.js';
import { AUTH_EXPIRY_HOURS } from '../config.js';
import { sanitizeURL, setAvatarSafe } from './sanitize.js';
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
        if (hours > AUTH_EXPIRY_HOURS) { localStorage.removeItem('mrdev_local_auth'); return null; }
        return data;
    } catch (e) { return null; }
}

export function getCurrentUser() { return currentUser; }

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text || '';
}

function setAvatar(id, photoURL, fallback) {
    const el = document.getElementById(id);
    if (!el) return;
    setAvatarSafe(el, photoURL, fallback || '?');
}

export function updateUIForUser(user) {
    if (!user) {
        ['sidebarUser','sidebarLogout'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
        const sl = document.getElementById('sidebarLogin'); if (sl) sl.style.display = 'block';
        const nn = document.getElementById('notifNav'); if (nn) nn.style.display = 'none';
        
        const mh = document.getElementById('userMenuHeader'); if (mh) mh.style.display = 'none';
        const ml = document.getElementById('userMenuLogin'); if (ml) ml.style.display = 'block';
        const mo = document.getElementById('userMenuLogout'); if (mo) mo.style.display = 'none';
        const nm = document.getElementById('notifMenuLink'); if (nm) nm.style.display = 'none';
        
        const av = document.getElementById('headerUserAvatar'); if (av) av.textContent = '?';
        const nm2 = document.getElementById('headerUserName'); if (nm2) nm2.textContent = t('guest');
        return;
    }

    const dn = user.displayName || user.email?.split('@')[0] || 'User';
    const email = user.email || '';
    const avatar = dn.charAt(0).toUpperCase();
    const mrdevId = user.mrdevId || localStorage.getItem('mrdev_user_id') || '';

    logger.auth.currentUser(dn, mrdevId || '(yo\'q)');

    setText('sidebarName', dn);
    setText('sidebarEmail', email);
    setText('sidebarMrdevId', mrdevId);
    setAvatar('sidebarAvatar', user.photoURL, avatar);
    ['sidebarUser','sidebarLogout'].forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'flex'; });
    const sl = document.getElementById('sidebarLogin'); if (sl) sl.style.display = 'none';
    const nn = document.getElementById('notifNav'); if (nn) nn.style.display = 'flex';

    const mh = document.getElementById('userMenuHeader'); if (mh) mh.style.display = 'flex';
    const ml = document.getElementById('userMenuLogin'); if (ml) ml.style.display = 'none';
    const mo = document.getElementById('userMenuLogout'); if (mo) mo.style.display = 'flex';
    const nm = document.getElementById('notifMenuLink'); if (nm) nm.style.display = 'flex';
    setText('menuName', dn);
    setText('menuEmail', email);
    setText('menuMrdevId', mrdevId);
    setAvatar('menuAvatar', user.photoURL, avatar);

    const av = document.getElementById('headerUserAvatar');
    if (av) setAvatarSafe(av, user.photoURL, avatar);
    const nm2 = document.getElementById('headerUserName'); if (nm2) nm2.textContent = dn;

    const ta = document.querySelector('#mrdevUserTrigger .trigger-avatar');
    const tn = document.querySelector('#mrdevUserTrigger .trigger-name');
    if (ta && tn) {
        setAvatarSafe(ta, user.photoURL, avatar, '');
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
    logger.auth.start('v6.0');

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
                mrdevId: mrdevId,
                providerData: firebaseUser.providerData || [],
                isAuthenticated: true
            };

            saveLocalAuth({
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: currentUser.displayName,
                photoURL: firebaseUser.photoURL,
                mrdevId: mrdevId,
                provider: firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email',
                authType: firebaseUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'email'
            });

            addOrUpdateAccount(currentUser, { mrdevId, provider: firebaseUser.providerData?.[0]?.providerId || 'email' });

            updateUIForUser(currentUser);
            try { initDropdown(currentUser); } catch (e) {
                logger.error.dropdown(e.message);
            }

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
                updateUIForUser(currentUser);
                try { initDropdown(currentUser); } catch (e) {
                    logger.error.dropdown(e.message);
                }
            } else {
                currentUser = null;
                updateUIForUser(null);
                try { initDropdown(null); } catch (e) {
                    logger.error.dropdown(e.message);
                }
            }
        }
    });
}