// ==================== MRDEV PASS NOTIFICATIONS v4.1 ====================
// BUG #1 FIX: pass_notifications/$uid yo'li + passCode ko'rsatilmaydi (hash)

import logger from '../core/logger.js';
import { auth, rtdb } from '../core/firebase-init.js';
import { ref, get } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { showToast } from '../core/toast.js';
import { showModal, closeModal } from '../ui/modal.js';
import { getNotificationsEnabled } from '../core/global-settings.js';
import { t } from '../core/i18n.js';

export function showPassNotifications() {
    if (!getNotificationsEnabled()) {
        showToast(t('notifications_disabled') || "Bildirishnomalar o'chirilgan", 'info');
        return;
    }

    let uid   = null;
    let email = null;

    // 1. Firebase Auth user
    if (auth && auth.currentUser) {
        uid   = auth.currentUser.uid;
        email = auth.currentUser.email;
        logger.notif.firebaseUser(uid);
    }

    // 2. Local auth user
    if (!uid) {
        try {
            const local = JSON.parse(localStorage.getItem('mrdev_local_auth') || 'null');
            if (local && local.isLoggedIn && local.uid) {
                uid   = local.uid;
                email = local.email;
                logger.notif.localUser(uid);
            }
        } catch (e) {
            logger.error.auth(e.message);
        }
    }

    if (!uid) {
        showToast(t('login_required') || 'Hisobga kiring', 'error');
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

    container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--text-3);">⏳ ${t('loading')}</div>`;

    try {
        if (!rtdb) {
            container.innerHTML = `<div style="text-align:center;padding:20px;color:var(--red);">Database ulanishi yo'q</div>`;
            return;
        }

        logger.notif.searching(uid, email);

        // BUG #1 FIX: faqat o'z UID'i ostidagi yozuvlarni o'qiymiz
        const notifRef = ref(rtdb, `pass_notifications/${uid}`);
        const snapshot = await get(notifRef);

        if (!snapshot.exists()) {
            container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-3);">📭 ${t('no_notifications') || "Xabarlar yo'q"}</div>`;
            return;
        }

        const items = [];
        snapshot.forEach((child) => {
            const data = child.val();
            if (!data) return;
            // Per-uid path bo'lgani uchun qo'shimcha UID filtri shart emas
            items.push({ id: child.key, ...data, createdAt: data.createdAt || Date.now() });
        });

        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        logger.notif.found(items.length);

        if (!items.length) {
            container.innerHTML = `<div style="text-align:center;padding:30px;color:var(--text-3);">📭 ${t('no_notifications') || "Xabarlar yo'q"}</div>`;
            return;
        }

        container.innerHTML = items.map(data => {
            const date      = new Date(data.createdAt || Date.now());
            const isExpired = Date.now() > (data.expiresAt || 0);
            const isUsed    = data.used === true;

            let status     = 'active';
            let statusText = `✅ ${t('active_status')}`;

            if (isUsed) {
                status = 'used'; statusText = `✓ ${t('used')}`;
            } else if (isExpired) {
                status = 'expired'; statusText = `⏰ ${t('expired')}`;
            }

            return `
                <div class="pass-notif-item">
                    <div class="pass-notif-header">
                        <span class="pass-notif-code">••••••</span>
                        <span class="pass-notif-status ${status}">${statusText}</span>
                    </div>
                    <div class="pass-notif-date">
                        ${date.toLocaleString('uz-UZ')} | ID: ${data.mrdevId || '?'}
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        logger.notif.error(error.message);
        container.innerHTML = `
            <div style="text-align:center;padding:20px;color:var(--red);">
                ⚠️ ${t('error') || 'Xatolik'}: ${error.message}
                <button onclick="location.reload()"
                    style="display:block;margin:12px auto;padding:8px 16px;cursor:pointer;">
                    ${t('reload') || 'Qayta yuklash'}
                </button>
            </div>
        `;
    }
}

// Notifications o'zgarishini kuzatish
document.addEventListener('notificationsChanged', (e) => {
    logger.settings.notificationsSaved(e.detail.enabled);
});