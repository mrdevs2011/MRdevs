// ==================== MRDEV NOTIFICATION SYSTEM v2.0 ====================
// Navbatma-navbat (bitta vaqtda 1 ta), hover-pause, classic va sodda

import { getNotificationsEnabled } from './global-settings.js';
import { popularApps, miniApps } from '../ui/tabs.js';

// ==================== CONFIG ====================
const CFG = {
    MAX_VISIBLE:      1,           // Bir vaqtda faqat 1 ta notif
    AD_COOLDOWN_H:    24,          // Ads kun da 1 marta
    AD_PER_SESSION:   1,           // Bir sessiyada max 1 ta ad
    AUTO_DISMISS: {
        error:     8000,
        otp:       12000,
        new_login: 7000,
        ad:        8000,
        info:      5000,
        warning:   7000,
    },
    LONG_TEXT_CHARS:  120,
    GROUP_WINDOW_MS:  600,
};

// ==================== STATE ====================
let queue = [];
let active = [];         // max 1 ta
let root = null;
let groupBuffer = {};
let _adsShownThisSession = 0;

// ==================== INIT ====================
function ensureRoot() {
    if (root && document.contains(root)) return root;
    root = document.getElementById('mrdev-notif-root');
    if (!root) {
        root = document.createElement('div');
        root.id = 'mrdev-notif-root';
        document.body.appendChild(root);
    }
    return root;
}

// ==================== PUBLIC API ====================

/**
 * Notification yuborish
 */
export function notify(opts) {
    if (!getNotificationsEnabled()) return;

    const notif = {
        id:        `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type:      opts.type      || 'info',
        title:     opts.title     || 'MRDEV',
        message:   opts.message   || '',
        sourceKey: opts.sourceKey || opts.type,
        appIcon:   opts.appIcon   || null,
        appName:   opts.appName   || null,
        duration:  opts.duration  ?? CFG.AUTO_DISMISS[opts.type] ?? 5000,
        createdAt: Date.now(),
    };

    const sk = notif.sourceKey;
    if (!groupBuffer[sk]) {
        groupBuffer[sk] = { notifs: [], timer: null };
    }
    const buf = groupBuffer[sk];
    buf.notifs.push(notif);

    clearTimeout(buf.timer);
    buf.timer = setTimeout(() => {
        flushGroup(sk);
    }, CFG.GROUP_WINDOW_MS);
}

function flushGroup(sk) {
    if (!groupBuffer[sk]) return;
    const { notifs } = groupBuffer[sk];
    delete groupBuffer[sk];

    if (!notifs.length) return;

    if (notifs.length === 1) {
        enqueue(notifs[0]);
    } else {
        const combined = {
            ...notifs[0],
            id:       `grp_${Date.now()}`,
            messages: notifs.map(n => n.message),
            message:  notifs[0].message,
            isGroup:  true,
            duration: Math.max(...notifs.map(n => n.duration)),
        };
        enqueue(combined);
    }
}

function enqueue(notif) {
    queue.push(notif);
    drainQueue();
}

function _notifyRaw(opts) {
    if (!getNotificationsEnabled()) return;
    const notif = {
        id:         `n_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        type:       opts.type      || 'info',
        title:      opts.title     || 'MRDEV',
        message:    opts.message   || '',
        customBody: opts.customBody || null,
        sourceKey:  opts.sourceKey || opts.type,
        duration:   opts.duration  ?? CFG.AUTO_DISMISS[opts.type] ?? 5000,
        createdAt:  Date.now(),
    };
    enqueue(notif);
}

function drainQueue() {
    // Bitta vaqtda faqat 1 ta — active bo'sh bo'lsagina keyingisini ko'rsat
    if (active.length < CFG.MAX_VISIBLE && queue.length > 0) {
        const next = queue.shift();
        showNotif(next);
    }
}

// ==================== RENDER ====================
function showNotif(notif) {
    ensureRoot();
    active.push(notif);

    const el = document.createElement('div');
    el.className = `mrdev-notif type-${notif.type}`;
    el.dataset.id = notif.id;

    el.innerHTML = buildHTML(notif);
    root.appendChild(el);

    // Entrance animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            el.classList.add('notif-enter');
        });
    });

    // Progress bar
    const bar = el.querySelector('.mrdev-notif-progress-bar');

    // Auto-dismiss + hover pause
    let dismissTimer = null;
    let remaining = notif.duration;
    let startedAt = Date.now();
    let paused = false;

    function startTimer(ms) {
        if (ms <= 0) return;
        startedAt = Date.now();
        dismissTimer = setTimeout(() => {
            if (!paused) dismiss(el, notif.id);
        }, ms);
    }

    function pauseTimer() {
        if (paused || notif.duration <= 0) return;
        paused = true;
        clearTimeout(dismissTimer);
        remaining = remaining - (Date.now() - startedAt);
        if (remaining < 0) remaining = 0;
        // Progress barni to'xtatish
        if (bar) {
            const computed = getComputedStyle(bar);
            bar.style.transition = 'none';
            bar.style.width = computed.width;
        }
    }

    function resumeTimer() {
        if (!paused || notif.duration <= 0) return;
        paused = false;
        // Progress barni davom ettirish
        if (bar && remaining > 0) {
            requestAnimationFrame(() => {
                bar.style.transition = `width ${remaining}ms linear`;
                bar.style.width = '0%';
            });
        }
        startTimer(remaining);
    }

    // Progress bar start
    if (bar && notif.duration > 0) {
        bar.style.width = '100%';
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                bar.style.transition = `width ${notif.duration}ms linear`;
                bar.style.width = '0%';
            });
        });
    }

    if (notif.duration > 0) {
        startTimer(notif.duration);
    }

    // Hover: to'xtatish / davom ettirish
    el.addEventListener('mouseenter', pauseTimer);
    el.addEventListener('mouseleave', resumeTimer);

    // Click: dismiss
    el.addEventListener('click', (e) => {
        if (e.target.closest('.mrdev-notif-expand-btn')) return;
        if (e.target.closest('.mrdev-notif-dismiss')) return;
        clearTimeout(dismissTimer);
        dismiss(el, notif.id);
    });

    // ✕ tugma
    const closeBtn = el.querySelector('.mrdev-notif-dismiss');
    if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            clearTimeout(dismissTimer);
            dismiss(el, notif.id);
        });
    }

    // Expand toggle
    const expandBtn = el.querySelector('.mrdev-notif-expand-btn');
    const textEl    = el.querySelector('.mrdev-notif-text-collapsed');
    if (expandBtn && textEl) {
        expandBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isExpanded = textEl.classList.toggle('expanded');
            expandBtn.classList.toggle('expanded', isExpanded);
            // Chevron belgisi o'zgartiriladi CSS bilan — faqat aria
            expandBtn.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        });
    }

    // OTP reveal
    const otpCode = el.querySelector('.mrdev-notif-otp-code');
    if (otpCode) {
        otpCode.addEventListener('click', (e) => {
            e.stopPropagation();
            const val = otpCode.querySelector('.mrdev-notif-otp-value');
            if (val) val.classList.toggle('revealed');
        });
    }
}

function buildHTML(notif) {
    const timeStr = new Date(notif.createdAt).toLocaleTimeString('uz-UZ', {
        hour: '2-digit', minute: '2-digit'
    });

    // Ad notif uchun ilova ikonkasi (yulduzcha yo'q — faqat app icon)
    // Boshqa notiflar uchun oddiy SVG icon
    let iconHTML = '';
    if (notif.type === 'ad' && notif.appIcon) {
        // Ad uchun icon — app ikonkasini ishlatamiz, yulduzcha yo'q
        iconHTML = `<img class="mrdev-notif-app-icon-main" src="${notif.appIcon}" alt="${escHtml(notif.appName || '')}">`;
    } else {
        iconHTML = ICONS[notif.type] || ICONS.info;
    }

    // Body
    let bodyHTML = '';
    if (notif.customBody) {
        bodyHTML = notif.customBody;
    } else if (notif.isGroup && notif.messages?.length > 1) {
        const items = notif.messages.map(msg => `
            <div class="mrdev-notif-group-item">
                <span class="group-dot"></span>${escHtml(msg)}
            </div>`).join('');
        bodyHTML = `<div class="mrdev-notif-group">${items}</div>`;
    } else {
        const msg = escHtml(notif.message);
        if (notif.message.length > CFG.LONG_TEXT_CHARS) {
            bodyHTML = `
                <div class="mrdev-notif-expandable">
                    <div class="mrdev-notif-text-collapsed">${msg}</div>
                    <button class="mrdev-notif-expand-btn" type="button" aria-expanded="false">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                            <polyline points="6 9 12 15 18 9"/>
                        </svg>
                        <span class="expand-label">Ko'proq</span>
                    </button>
                </div>`;
        } else {
            bodyHTML = `<div class="mrdev-notif-body">${msg}</div>`;
        }
    }

    const badge = notif.isGroup && notif.messages?.length > 1
        ? `<span class="mrdev-notif-badge">${notif.messages.length}</span>` : '';

    return `
        <div class="mrdev-notif-progress">
            <div class="mrdev-notif-progress-bar"></div>
        </div>
        <div class="mrdev-notif-inner">
            <div class="mrdev-notif-head">
                <div class="mrdev-notif-icon">${iconHTML}</div>
                <span class="mrdev-notif-title">${escHtml(notif.title)}${badge}</span>
                <span class="mrdev-notif-time">${timeStr}</span>
                <button class="mrdev-notif-dismiss" type="button" title="Yopish">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>
            ${bodyHTML}
        </div>`;
}

function dismiss(el, id) {
    if (!el || el.classList.contains('notif-exit')) return;
    el.classList.add('notif-exit');

    const dur = parseFloat(getComputedStyle(el).transitionDuration) * 1000 || 240;
    setTimeout(() => {
        el.remove();
        active = active.filter(n => n.id !== id);
        // Keyingi notifni chiqar
        drainQueue();
    }, dur + 20);
}

// ==================== ICONS ====================
const ICONS = {
    error: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
    otp: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>`,
    new_login: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>`,
    ad: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
    </svg>`,
    info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>`,
    warning: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>`,
};

// ==================== HELPERS ====================
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// ==================== APP USAGE TRACKING ====================
const APP_USAGE_PREFIX = 'mrdev_app_used_';

export function trackAppVisit(appId) {
    localStorage.setItem(APP_USAGE_PREFIX + appId, String(Date.now()));
}

/**
 * Kun da 1 marta, sessiyada 1 marta ad ko'rsatish
 */
export function checkInactiveApps() {
    if (!getNotificationsEnabled()) return;
    if (_adsShownThisSession >= CFG.AD_PER_SESSION) return;

    const allApps = [...popularApps, ...miniApps];

    const now       = Date.now();
    const cooldown  = CFG.AD_COOLDOWN_H * 60 * 60 * 1000; // 24 soat
    const AD_SHOWN_KEY = 'mrdev_ad_shown_';

    // Faqat 1 ta app tanlash — eng ko'p kutgani
    let bestApp = null;
    let bestGap = 0;

    for (const app of allApps) {
        const appId   = app.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const lastAd  = parseInt(localStorage.getItem(AD_SHOWN_KEY + appId) || '0');
        const lastUsed = parseInt(localStorage.getItem(APP_USAGE_PREFIX + appId) || '0');

        const adCooldownOk = now - lastAd > cooldown;
        const isInactive   = lastUsed === 0 || (now - lastUsed > 7 * 24 * 60 * 60 * 1000); // 7 kundan beri

        if (adCooldownOk && isInactive) {
            const gap = now - lastUsed;
            if (gap > bestGap) {
                bestGap = gap;
                bestApp = { app, appId };
            }
        }
    }

    if (!bestApp) return;

    const { app, appId } = bestApp;
    const lastUsed = parseInt(localStorage.getItem(APP_USAGE_PREFIX + appId) || '0');

    localStorage.setItem(AD_SHOWN_KEY + appId, String(now));
    _adsShownThisSession++;

    const days = lastUsed === 0
        ? 'Hali sinab ko\'rmagansiz'
        : `${Math.floor((now - lastUsed) / (24 * 60 * 60 * 1000))} kun ko\'rilmadi`;

    // 5 soniya kechiktirish — sahifa yuklangandan keyin
    setTimeout(() => {
        notify({
            type:      'ad',
            title:     app.name,
            message:   `${days}. Bir qarang, foydali bo'lishi mumkin.`,
            sourceKey: 'ad_' + appId,
            appIcon:   `./assets/favicons/${app.icon}`,
            appName:   app.name,
            duration:  8000,
        });
    }, 5000);
}

// ==================== NEW LOGIN ====================
let _knownUids = new Set();

export function onAuthUserDetected(user) {
    if (!user?.uid) return;
    if (_knownUids.has(user.uid)) return;

    const isFirst = _knownUids.size === 0;
    _knownUids.add(user.uid);

    if (!getNotificationsEnabled()) return;

    if (!isFirst) {
        const name = user.displayName || user.email || 'Foydalanuvchi';
        notify({
            type:      'new_login',
            title:     'Yangi akkaunt kirdi',
            message:   `${name} hisobidan kirish aniqlandi. Bu siz emasmi? Xavfsizlikni tekshiring.`,
            sourceKey: 'new_login',
            duration:  10000,
        });
    } else {
        const name = user.displayName || user.email || '';
        notify({
            type:      'info',
            title:     'Xush kelibsiz!',
            message:   name ? `${name}, MRDEV ga xush kelibsiz` : 'MRDEV ga xush kelibsiz!',
            sourceKey: 'welcome',
            duration:  5000,
        });
    }
}

// ==================== SYSTEM HELPERS ====================
export function notifyError(message, title = 'Tizim xatosi') {
    if (!getNotificationsEnabled()) return;
    notify({ type: 'error', title, message, sourceKey: 'system_error' });
}

export function notifyOTP(passCode, mrdevId, notifDbId = null) {
    if (!getNotificationsEnabled()) return;

    if (notifDbId) {
        const shownKey = 'mrdev_otp_shown_' + notifDbId;
        if (sessionStorage.getItem(shownKey)) return;
        sessionStorage.setItem(shownKey, '1');
    }

    const otpHTML = `
        <div style="font-size:13px;color:var(--text-2);font-family:var(--font-sans);margin-bottom:4px;">
            Yangi parol kodi${mrdevId ? ` · ID: <b>${escHtml(mrdevId)}</b>` : ''}
        </div>
        <div class="mrdev-notif-otp-code" title="Ko'rish uchun bosing">
            <span class="mrdev-notif-otp-value">${escHtml(passCode)}</span>
            <span class="mrdev-notif-otp-hint">bosing</span>
        </div>`;

    _notifyRaw({
        type:      'otp',
        title:     'Parol kodi',
        customBody: otpHTML,
        sourceKey: 'otp_' + (notifDbId || passCode),
        duration:  CFG.AUTO_DISMISS.otp,
    });
}

// ==================== GLOBAL EVENTS ====================
document.addEventListener('mrdev:notify',       (e) => { if (e.detail) notify(e.detail); });
document.addEventListener('mrdev:notify_error', (e) => { if (e.detail) notifyError(e.detail.message, e.detail.title); });
document.addEventListener('mrdev:notify_otp',   (e) => { if (e.detail) notifyOTP(e.detail.passCode, e.detail.mrdevId); });
document.addEventListener('mrdev:new_account',  (e) => { if (e.detail) onAuthUserDetected(e.detail); });

document.addEventListener('notificationsChanged', (e) => {
    if (!e.detail?.enabled) {
        document.querySelectorAll('.mrdev-notif:not(.notif-exit)').forEach(el => {
            dismiss(el, el.dataset.id);
        });
        queue = [];
    }
});

// ==================== INIT ====================
export function initNotificationSystem() {
    ensureRoot();
    setTimeout(() => checkInactiveApps(), 5000);
}

// initNotificationSystem() ni faqat app.js chaqiradi — bu yerda avtomatik init yo'q.

window.mrdevNotify      = notify;
window.mrdevNotifyError = notifyError;
window.mrdevNotifyOTP   = notifyOTP;