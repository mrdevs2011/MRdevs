// ==================== MRDEV UNIVERSAL AUTH HELPER v4.0 ====================

import logger from './logger.js';
import { auth, db } from './firebase-init.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    doc, getDoc, updateDoc, arrayUnion
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// ==================== YORDAMCHILAR ====================

export function getCenterUserId(email) {
    if (!email) return null;
    return email.replace(/[.@]/g, '_');
}

function getAuthType(firebaseUser) {
    if (!firebaseUser) return 'none';
    const providerId = firebaseUser.providerData?.[0]?.providerId || 'password';
    return providerId === 'google.com' ? 'google' : 'email';
}

// ==================== ASOSIY FUNKSIYALAR ====================

export async function getCurrentUser() {
    // 1. Firebase Auth
    if (auth?.currentUser) {
        const u        = auth.currentUser;
        const authType = getAuthType(u);
        const mrdevId  = localStorage.getItem('mrdev_user_id') || '';

        return {
            uid:             u.uid,
            firebaseUid:     u.uid,
            email:           u.email,
            displayName:     u.displayName || u.email?.split('@')[0] || 'User',
            photoURL:        u.photoURL || null,
            mrdevId:         mrdevId,
            isAuthenticated: true,
            authType:        authType
        };
    }

    // 2. MRDEV Local Auth
    try {
        const local = JSON.parse(localStorage.getItem('mrdev_local_auth'));
        if (local?.isLoggedIn && local?.uid && local?.email) {
            const days = (Date.now() - (local.loginTime || 0)) / (1000 * 60 * 60 * 24);
            if (days < 7) {
                return {
                    uid:             local.uid,
                    firebaseUid:     local.uid,
                    email:           local.email,
                    displayName:     local.displayName || 'User',
                    photoURL:        local.photoURL || null,
                    mrdevId:         local.mrdevId || localStorage.getItem('mrdev_user_id') || '',
                    isAuthenticated: true,
                    authType:        local.authType || 'mrdev'
                };
            }
        }
    } catch (e) {
        logger.error.auth(e.message);
    }

    // 3. Auth yo'q
    return {
        uid:             null,
        email:           null,
        displayName:     null,
        photoURL:        null,
        mrdevId:         '',
        isAuthenticated: false,
        authType:        'none'
    };
}

export function getUserId() {
    const fbUser = auth?.currentUser;
    if (fbUser) return fbUser.uid;

    try {
        const local = JSON.parse(localStorage.getItem('mrdev_local_auth'));
        if (local?.isLoggedIn && local?.uid) return local.uid;
    } catch (e) {}

    return null;
}

export function isAuthenticated() {
    if (auth?.currentUser) return true;
    try {
        return JSON.parse(localStorage.getItem('mrdev_local_auth') || '{}')?.isLoggedIn === true;
    } catch (e) {
        return false;
    }
}

export function getUserEmail() {
    return auth?.currentUser?.email ||
        (() => {
            try { return JSON.parse(localStorage.getItem('mrdev_local_auth') || '{}')?.email; } catch (e) { return null; }
        })();
}

export function getUserDisplayName() {
    const fbUser = auth?.currentUser;
    if (fbUser) return fbUser.displayName || fbUser.email?.split('@')[0] || 'User';

    try {
        const local = JSON.parse(localStorage.getItem('mrdev_local_auth') || '{}');
        return local.displayName || (window.mrdevI18n ? window.mrdevI18n.t('guest') : 'Guest');
    } catch (e) {
        return window.mrdevI18n ? window.mrdevI18n.t('guest') : 'Guest';
    }
}

export function onAuthChange(callback) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const authType = getAuthType(firebaseUser);
            const mrdevId  = localStorage.getItem('mrdev_user_id') || '';

            callback({
                uid:             firebaseUser.uid,
                firebaseUid:     firebaseUser.uid,
                email:           firebaseUser.email,
                displayName:     firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                photoURL:        firebaseUser.photoURL || null,
                mrdevId:         mrdevId,
                isAuthenticated: true,
                authType:        authType
            });
        } else {
            const user = await getCurrentUser();
            callback(user);
        }
    });
}

// ==================== MRDEV ID YORDAMCHILARI ====================

export async function getMrdevId(uid) {
    if (!uid) return null;
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? snap.data().mrdevId || null : null;
    } catch (e) {
        logger.error.firebase(e.message);
        return null;
    }
}

/**
 * Deprecated — backward compatibility uchun saqlab qolindi.
 * saveUserMrdevId (notif-pass.js) bu ishni qiladi.
 */
export async function addMrdevIdToCenter(email, mrdevId) {
    logger.debug.warn('[AuthHelper] addMrdevIdToCenter deprecated:', email, mrdevId);
}
