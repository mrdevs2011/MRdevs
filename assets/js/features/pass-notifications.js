// ==================== MRDEV PASS NOTIFICATIONS v4.0 ====================
// Global notifications bilan integratsiyalashgan

import { auth, rtdb } from '../core/firebase-init.js';
import { ref, get } from 'firebase/database';
import { showToast } from '../core/toast.js';
import { showModal, closeModal } from '../ui/modal.js';
import { getNotificationsEnabled } from '../core/global-settings.js';
import { t, getCurrentLang } from '../core/i18n.js';
import logger from '../core/logger.js';
import { notifyOTP, notifyError } from '../core/notification-system.js';

// Til → locale mapping (toLocaleString uchun)
const LANG_LOCALES = {
    uz: 'uz-UZ',
    ru: 'ru-RU',
    en: 'en-US'
};

export function showPassNotifications() {
    // Notifications sozlamasini tekshirish
    if (!getNotificationsEnabled()) {
        showToast(t('notifications_disabled'), 'info');
        return;
    }
    
    let uid = null;
    let email = null;

    // 1. Firebase Auth user tekshirish
    if (auth && auth.currentUser) {
        uid = auth.currentUser.uid;
        email = auth.currentUser.email;
        logger.notif.firebaseUser(uid);
    }

    // 2. Local auth user tekshirish
    if (!uid) {
        try {
            const local = JSON.parse(localStorage.getItem('mrdev_local_auth') || 'null');
            if (local && local.isLoggedIn && local.uid) {
                uid = local.uid;
                email = local.email;
                logger.notif.localUser(uid);
            }
        } catch (e) {
            logger.notif.localParseError(e.message);
        }
    }

    if (!uid) {
        showToast(t('login_required'), 'error');
        return;
    }

    showModal('passNotifModal');
    loadPassNotifications(uid, email);
}

export function closePassNotifModal() {
    closeModal('passNotifModal');
}

async function loadPassNotifications(uid, email) {
    const container = document.getElementById('passNotifList');
    if (!container) return;

    container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-3);"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;vertical-align:middle"><circle cx="12" cy="12" r="10" stroke-opacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10"/></svg> ${t('loading')}</div>`;

    try {
        if (!rtdb) {
            container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--red);">${t('db_no_connection')}</div>`;
            return;
        }

        logger.notif.searching(uid, email);

        const notifRef = ref(rtdb, 'pass_notifications');
        const snapshot = await get(notifRef);

        if (!snapshot.exists()) {
            container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-3);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:middle;opacity:.5"><path d="M22 12h-6l-2 3H10l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg> ${t('no_notifications')}</div>`;
            return;
        }

        const items = [];
        snapshot.forEach((child) => {
            const data = child.val();
            if (!data) return;

            const matchesUid = (uid && (data.uid === uid || data.firestoreUid === uid));
            const matchesEmail = (email && data.email === email);

            if (matchesUid || matchesEmail) {
                items.push({
                    id: child.key,
                    ...data,
                    createdAt: data.createdAt || Date.now()
                });
            }
        });

        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        logger.notif.found(items.length);

        if (!items.length) {
            container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-3);"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="vertical-align:middle;opacity:.5"><path d="M22 12h-6l-2 3H10l-2-3H2"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg> ${t('no_notifications')}</div>`;
            return;
        }

        const locale = LANG_LOCALES[getCurrentLang()] || 'en-US';

        container.innerHTML = items.map(data => {
            const date = new Date(data.createdAt || Date.now());
            const isExpired = Date.now() > (data.expiresAt || 0);
            const isUsed = data.used === true;

            let status = 'active';
            let statusText = t('active_status');

            if (isUsed) {
                status = 'used';
                statusText = t('used');
            } else if (isExpired) {
                status = 'expired';
                statusText = t('expired');
            }

            return `
                <div class="pass-notif-item">
                    <div class="pass-notif-header">
                        <span class="pass-notif-code">${data.passCode || '------'}</span>
                        <span class="pass-notif-status ${status}">${statusText}</span>
                    </div>
                    <div class="pass-notif-date">
                        ${date.toLocaleString(locale)} | ID: ${data.mrdevId || '?'}
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        logger.notif.error(error.message);
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:var(--red);">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> ${t('error')}: ${error.message}
                <button onclick="location.reload()"
                    style="display:block;margin:12px auto;padding:8px 16px;cursor:pointer;">
                    ${t('reload')}
                </button>
            </div>
        `;
    }
}

// Notifications o'zgarishini kuzatish
document.addEventListener('notificationsChanged', (e) => {
    logger.notif.settingsChanged(e.detail.enabled);
});