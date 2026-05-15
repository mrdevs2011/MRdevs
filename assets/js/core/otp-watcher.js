// ==================== MRDEV OTP WATCHER v1.0 ====================
// Firebase RTDB dagi pass_notifications ni real-time kuzatadi
// Yangi aktiv OTP kelsa notification ko'rsatadi

import { auth, rtdb } from './firebase-init.js';
import { ref, onValue } from 'firebase/database';
import { notifyOTP } from './notification-system.js';
import { getNotificationsEnabled } from './global-settings.js';

let _unsubscribe = null;
let _seenIds = new Set();          // Bir sessiyada ko'rsatilgan notiflar
let _initialized = false;

// ==================== JORIY FOYDALANUVCHI ====================
function getCurrentUserInfo() {
    // 1. Firebase auth
    if (auth?.currentUser) {
        return { uid: auth.currentUser.uid, email: auth.currentUser.email };
    }
    // 2. localStorage fallback (MRDEV ID login)
    try {
        const local = JSON.parse(localStorage.getItem('mrdev_local_auth') || 'null');
        if (local?.isLoggedIn && local?.uid) {
            return { uid: local.uid, email: local.email };
        }
    } catch {}
    return null;
}

// ==================== LISTENER ISHGA TUSHIRISH ====================
export function initOtpWatcher() {
    if (_initialized) return;
    _initialized = true;

    // 2 soniya kechiktir — auth o'rniqsin
    setTimeout(startWatching, 2000);

    // Auth o'zgarishini document event orqali ham kuzat
    document.addEventListener('mrdev:new_account', () => {
        stopWatching();
        setTimeout(startWatching, 500);
    });
}

function startWatching() {
    if (!rtdb) return;
    if (!getNotificationsEnabled()) return;

    stopWatching(); // Avvalgisini o'chir

    const userInfo = getCurrentUserInfo();
    if (!userInfo) {
        // Foydalanuvchi yo'q — 5 soniya keyin qayta urinib ko'r
        setTimeout(startWatching, 5000);
        return;
    }

    const { uid } = userInfo;

    _unsubscribe = onValue(ref(rtdb, 'pass_notifications/' + uid), (snap) => {
        if (!getNotificationsEnabled()) return;
        if (!snap.exists()) return;

        const now = Date.now();

        snap.forEach((child) => {
            const data = child.val();
            if (!data) return;

            const id = child.key;

            // Allaqachon ko'rsatilganmi?
            if (_seenIds.has(id)) return;

            // Aktiv (expired emas, ishlatilmagan)?
            if (data.used === true) return;
            if (data.expiresAt && now > data.expiresAt) return;

            // Ko'rsatilgan deb belgilab ol
            _seenIds.add(id);

            // Notification ko'rsat
            notifyOTP(data.passCode || '------', data.mrdevId || '', id);
        });
    });
}

function stopWatching() {
    if (_unsubscribe) {
        _unsubscribe();
        _unsubscribe = null;
    }
}

// Settings o'chganda listening to'xtash
document.addEventListener('notificationsChanged', (e) => {
    if (!e.detail?.enabled) {
        stopWatching();
    } else {
        setTimeout(startWatching, 300);
    }
});