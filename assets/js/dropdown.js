// ==================== MRDEV DROPDOWN SYSTEM v6.0 ====================
// i18n, global settings, skeleton loading, 2-step logout modal, settings link

import { showPassNotifications } from './features/pass-notifications.js';
import { logout } from './core/auth.js';
import { t } from './core/i18n.js';
import { getNotificationsEnabled } from './core/global-settings.js';

// ==================== YO'L ANIQLASH ====================
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/mini/') || path.includes('/popular/')) return '../..';
    return '.';
}

const BASE   = getBasePath();
const ASSETS = getBasePath();

const APPS_LIST = {
    popular: [
        { name: 'AI',        icon: 'ai',         path: `${BASE}/popular/ai/` },
        { name: 'GroupBoard',icon: 'groupboard',  path: `${BASE}/popular/groupboard/` },
        { name: 'LearnCode', icon: 'learncode',   path: `${BASE}/popular/learncode/` },
        { name: 'MrGram',    icon: 'mrgram',      path: `${BASE}/popular/mrgram/` },
        { name: 'NotifyHub', icon: 'notifyhub',   path: `${BASE}/popular/notifyhub/` },
        { name: 'Typing',    icon: 'typing',      path: `${BASE}/popular/typing/` },
        { name: 'Security',  icon: 'security',    path: `${BASE}/popular/security/` },
        { name: 'CodeStudio',icon: 'codestudio',  path: `${BASE}/popular/codestudio/` },
        { name: 'VideoHub',  icon: 'videohub',    path: `${BASE}/popular/videohub/` },
        { name: 'Weather',   icon: 'weather',     path: `${BASE}/popular/weather/` },
        { name: 'Notes',     icon: 'notes',       path: `${BASE}/popular/notes/` },
        { name: 'Todo',      icon: 'todo',        path: `${BASE}/popular/todo/` }
    ],
    mini: [
        { name: 'Calculator',icon: 'calculator',  path: `${BASE}/mini/calculator/` },
        { name: 'Bingo',     icon: 'bingo',       path: `${BASE}/mini/bingo/` },
        { name: 'Board',     icon: 'board',       path: `${BASE}/mini/board/` },
        { name: 'Music',     icon: 'music',       path: `${BASE}/mini/music/` },
        { name: 'SplitView', icon: 'splitview',   path: `${BASE}/mini/splitview/` },
        { name: 'Examer',    icon: 'examer',      path: `${BASE}/mini/examer/` },
        { name: 'Clock',     icon: 'clock',       path: `${BASE}/mini/clock/` },
        { name: 'Stopwatch', icon: 'stopwatch',   path: `${BASE}/mini/stopwatch/` },
        { name: 'Timer',     icon: 'timer',       path: `${BASE}/mini/timer/` },
        { name: 'QR Code',   icon: 'qr',          path: `${BASE}/mini/qr/` }
    ]
};

// ==================== IKONKA ====================
function getAppIconHTML(app, size) {
    const isLarge  = size === 'large';
    const prefix   = isLarge ? '-mini' : '';
    const iconSize = isLarge ? '48px' : '36px';
    const imgSize  = isLarge ? '26px' : '20px';
    return `
        <div class="dropdown-app-icon-grid${prefix}" style="width:${iconSize};height:${iconSize};">
            <img
                src="${ASSETS}/assets/favicons/${app.icon}.svg"
                alt="${app.name}"
                data-fallback="${app.name.substring(0, 2).toUpperCase()}"
                class="dropdown-icon-img-grid${prefix}"
                style="width:${imgSize};height:${imgSize};"
            >
        </div>
    `;
}

function attachIconFallbacks(container) {
    container.querySelectorAll('img[data-fallback]').forEach(img => {
        img.addEventListener('error', function () {
            const fallback = this.getAttribute('data-fallback') || '??';
            const parent   = this.parentElement;
            parent.innerHTML = `<span style="font-size:12px;font-weight:600;color:var(--text-3);">${fallback}</span>`;
            parent.style.display = 'flex';
            parent.style.alignItems = 'center';
            parent.style.justifyContent = 'center';
        });
    });
}

// ====================================================================
//  SKELETON / LOADING
// ====================================================================
export function setTriggerLoading(triggerElOrId, isLoading) {
    const el = typeof triggerElOrId === 'string'
        ? document.getElementById(triggerElOrId)
        : triggerElOrId;
    if (!el) return;
    if (isLoading) {
        el.classList.add('is-loading');
    } else {
        el.classList.remove('is-loading');
        const avatar = el.querySelector('.trigger-avatar, .header-user-avatar, .settings-user-avatar');
        const info   = el.querySelector('.trigger-info, .header-user-info');
        if (avatar) { avatar.classList.add('auth-reveal'); setTimeout(() => avatar.classList.remove('auth-reveal'), 600); }
        if (info)   { info.classList.add('auth-reveal');   setTimeout(() => info.classList.remove('auth-reveal'),   600); }
    }
}

export function setDropdownLoading(dropdownId, isLoading) {
    const el = document.getElementById(dropdownId);
    if (!el) return;
    el.classList.toggle('is-loading', isLoading);
}

// ====================================================================
//  LOGOUT MODAL — 2 bosqichli tasdiqlash
// ====================================================================
function injectLogoutModals() {
    if (document.getElementById('logoutModalStep1')) return;

    const html = `
        <div class="logout-modal-overlay" id="logoutModalStep1">
            <div class="logout-modal" id="logoutModalBox1">
                <div class="logout-modal-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                </div>
                <h3 class="logout-modal-title">Hisobingizdan chiqmoqchimisiz?</h3>
                <p class="logout-modal-desc">Tizimdan chiqsangiz barcha sessiyalar yopiladi.</p>
                <div class="logout-modal-actions">
                    <button class="logout-modal-btn cancel" id="logoutStep1No">Yo'q</button>
                    <button class="logout-modal-btn confirm" id="logoutStep1Yes">Ha, chiqaman</button>
                </div>
            </div>
        </div>

        <div class="logout-modal-overlay" id="logoutModalStep2">
            <div class="logout-modal" id="logoutModalBox2">
                <div class="logout-modal-icon warning">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <h3 class="logout-modal-title">Hisobdan chiqishni tasdiqlang</h3>
                <p class="logout-modal-desc">Bu amalni bekor qilib bo'lmaydi. Davom etasizmi?</p>
                <div class="logout-modal-actions">
                    <button class="logout-modal-btn cancel" id="logoutStep2Back">Orqaga</button>
                    <button class="logout-modal-btn danger" id="logoutStep2Confirm">Tasdiqlash</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);

    document.getElementById('logoutStep1No')?.addEventListener('click', closeAllLogoutModals);
    document.getElementById('logoutModalStep1')?.addEventListener('click', function (e) {
        if (e.target === this) closeAllLogoutModals();
    });
    document.getElementById('logoutStep1Yes')?.addEventListener('click', () => showLogoutModal(2));

    document.getElementById('logoutStep2Back')?.addEventListener('click', () => showLogoutModal(1));
    document.getElementById('logoutModalStep2')?.addEventListener('click', function (e) {
        if (e.target === this) closeAllLogoutModals();
    });
    document.getElementById('logoutStep2Confirm')?.addEventListener('click', async function () {
        closeAllLogoutModals();
        // Faqat trigger chetida ko'k chiziq aylansin
        const trigger = document.getElementById('mrdevUserTrigger')
                     || document.getElementById('headerUserTrigger')
                     || document.getElementById('mrdevUserTriggerMini');
        if (trigger) trigger.classList.add('is-loading');
        await logout();
    });
}

function showLogoutModal(step) {
    document.getElementById('logoutModalStep1')?.classList.toggle('show', step === 1);
    document.getElementById('logoutModalStep2')?.classList.toggle('show', step === 2);
    // pop animatsiyasi
    const box = document.getElementById(`logoutModalBox${step}`);
    if (box) {
        box.classList.remove('pop');
        void box.offsetWidth;
        box.classList.add('pop');
    }
}

function closeAllLogoutModals() {
    document.getElementById('logoutModalStep1')?.classList.remove('show');
    document.getElementById('logoutModalStep2')?.classList.remove('show');
}

// ====================================================================
//  ROOT DROPDOWN
// ====================================================================
export function initDropdown(user) {
    injectLogoutModals();

    if (!document.getElementById('mrdevDropdown')) {
        const settingsPath = `${BASE}/settings/`;
        const html = `
            <div class="mrdev-dropdown-overlay" id="mrdevDropdownOverlay"></div>
            <div class="mrdev-dropdown" id="mrdevDropdown">
                <div class="dropdown-profile">
                    <div class="dropdown-avatar" id="dropdownAvatar"></div>
                    <div class="dropdown-name"    id="dropdownName"></div>
                    <div class="dropdown-email"   id="dropdownEmail"></div>
                    <div class="dropdown-mrdev-id" id="dropdownMrdevId"></div>
                </div>
                <div class="dropdown-tabs">
                    <button class="dropdown-tab active" data-tab="all">${t('all_apps')}</button>
                    <button class="dropdown-tab" data-tab="popular">${t('popular_apps')}</button>
                    <button class="dropdown-tab" data-tab="mini">${t('mini_apps')}</button>
                </div>
                <div class="dropdown-apps" id="dropdownApps"></div>
                <div class="dropdown-menu-items">
                    <a href="#" class="dropdown-menu-item" id="notifMenuItem">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                        <span class="menu-item-text">${t('pass_notifications')}</span>
                        <span class="dropdown-notif-badge" id="notifBadge"></span>
                    </a>
                    <a href="${settingsPath}" class="dropdown-menu-item" id="settingsMenuItem">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="3"/>
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                        </svg>
                        <span class="menu-item-text">Sozlamalar</span>
                    </a>
                    <button class="dropdown-menu-item danger" id="logoutMenuItem">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span class="menu-item-text">${t('logout')}</span>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    updateRootUserInfo(user);

    document.querySelectorAll('#mrdevDropdown .dropdown-tab').forEach(tab => {
        tab.addEventListener('click', function () {
            document.querySelectorAll('#mrdevDropdown .dropdown-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            renderRootAppsGrid(this.dataset.tab);
        });
    });

    renderRootAppsGrid('all');
    setupRootTrigger(user);

    document.getElementById('notifMenuItem')?.addEventListener('click', function (e) {
        e.preventDefault();
        closeRootDropdown();
        showPassNotifications();
    });

    document.getElementById('logoutMenuItem')?.addEventListener('click', function () {
        closeRootDropdown();
        showLogoutModal(1);
    });

    const overlay  = document.getElementById('mrdevDropdownOverlay');
    const dropdown = document.getElementById('mrdevDropdown');
    const trigger  = document.getElementById('mrdevUserTrigger') || document.getElementById('headerUserTrigger');

    trigger?.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.contains('show') ? closeRootDropdown() : openRootDropdown();
        updateDropdownTexts();
    });

    overlay?.addEventListener('click', closeRootDropdown);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeRootDropdown();
            closeAllLogoutModals();
        }
    });

    document.addEventListener('click', function (e) {
        if (dropdown?.classList.contains('show') && !dropdown.contains(e.target) && trigger && !trigger.contains(e.target)) {
            closeRootDropdown();
        }
    });

    document.addEventListener('languageChanged', () => {
        updateDropdownTexts();
        updateRootUserInfo(window.currentUser || null);
    });
}

function updateDropdownTexts() {
    const tabs = document.querySelectorAll('#mrdevDropdown .dropdown-tab');
    if (tabs[0]) tabs[0].textContent = t('all_apps');
    if (tabs[1]) tabs[1].textContent = t('popular_apps');
    if (tabs[2]) tabs[2].textContent = t('mini_apps');

    const notifItem = document.getElementById('notifMenuItem');
    if (notifItem) {
        const textEl = notifItem.querySelector('.menu-item-text');
        if (textEl) textEl.textContent = t('pass_notifications');
    }
    const logoutItem = document.getElementById('logoutMenuItem');
    if (logoutItem) {
        const textEl = logoutItem.querySelector('.menu-item-text');
        if (textEl) textEl.textContent = t('logout');
    }
}

function updateRootUserInfo(user) {
    const avatar       = document.getElementById('dropdownAvatar');
    const name         = document.getElementById('dropdownName');
    const email        = document.getElementById('dropdownEmail');
    const mrdevId      = document.getElementById('dropdownMrdevId');
    const notifItem    = document.getElementById('notifMenuItem');
    const settingsItem = document.getElementById('settingsMenuItem');
    const logoutItem   = document.getElementById('logoutMenuItem');

    if (user) {
        const displayName = user.displayName || user.email?.split('@')[0] || 'User';
        const userEmail   = user.email || '';
        const userId      = user.mrdevId || localStorage.getItem('mrdev_user_id') || '';

        if (avatar) {
            avatar.innerHTML = user.photoURL
                ? `<img src="${user.photoURL}" alt="${displayName}">`
                : displayName.charAt(0).toUpperCase();
        }
        if (name)  name.textContent  = displayName;
        if (email) email.textContent = userEmail;
        if (mrdevId) { mrdevId.textContent = userId; mrdevId.style.display = userId ? 'block' : 'none'; }
        if (notifItem)    notifItem.style.display    = 'flex';
        if (settingsItem) settingsItem.style.display = 'flex';
        if (logoutItem)   logoutItem.style.display   = 'flex';
    } else {
        if (avatar)  avatar.textContent = '?';
        if (name)    name.textContent   = t('guest');
        if (email)   email.textContent  = t('login');
        if (mrdevId) mrdevId.style.display = 'none';
        if (notifItem)    notifItem.style.display    = 'none';
        if (settingsItem) settingsItem.style.display = 'none';
        if (logoutItem)   logoutItem.style.display   = 'none';
    }
}

function renderRootAppsGrid(category) {
    const container = document.getElementById('dropdownApps');
    if (!container) return;
    const apps = category === 'all'
        ? [...APPS_LIST.popular, ...APPS_LIST.mini]
        : (APPS_LIST[category] || []);
    container.innerHTML = `
        <div class="dropdown-apps-grid">
            ${apps.map(app => `
                <a href="${app.path}" class="dropdown-app-grid-item" title="${app.name}">
                    ${getAppIconHTML(app, 'small')}
                    <span class="dropdown-app-grid-name">${app.name}</span>
                </a>
            `).join('')}
        </div>
    `;
    attachIconFallbacks(container);
}

function setupRootTrigger(user) {
    const trigger = document.getElementById('mrdevUserTrigger') || document.getElementById('headerUserTrigger');
    if (!trigger || !user) return;

    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const photoHTML   = user.photoURL
        ? `<img src="${user.photoURL}" alt="${displayName}">`
        : displayName.charAt(0).toUpperCase();

    const hAvatar = trigger.querySelector('.header-user-avatar');
    const hName   = trigger.querySelector('.header-user-name');
    if (hAvatar) hAvatar.innerHTML = photoHTML;
    if (hName)   hName.textContent = displayName;

    const tAvatar = trigger.querySelector('.trigger-avatar');
    const tName   = trigger.querySelector('.trigger-name');
    if (tAvatar) tAvatar.innerHTML = photoHTML;
    if (tName)   tName.textContent = displayName;

    setTriggerLoading(trigger, false);
}

function openRootDropdown() {
    document.getElementById('mrdevDropdownOverlay')?.classList.add('show');
    document.getElementById('mrdevDropdown')?.classList.add('show');
}

function closeRootDropdown() {
    document.getElementById('mrdevDropdownOverlay')?.classList.remove('show');
    document.getElementById('mrdevDropdown')?.classList.remove('show');
}

// ====================================================================
//  MINI APPS DROPDOWN
// ====================================================================
export function initMiniDropdown(user) {
    injectLogoutModals();

    if (!document.getElementById('mrdevDropdownMini')) {
        const html = `
            <div class="mrdev-dropdown-overlay" id="mrdevDropdownOverlayMini"></div>
            <div class="mrdev-dropdown-mini" id="mrdevDropdownMini">
                <div class="dropdown-profile-mini">
                    <div class="dropdown-avatar" id="dropdownAvatarMini"></div>
                    <div>
                        <div class="dropdown-name"  id="dropdownNameMini"></div>
                        <div class="dropdown-email" id="dropdownEmailMini"></div>
                    </div>
                </div>
                <div class="dropdown-apps" id="dropdownAppsMini"></div>
                <div class="dropdown-menu-items mini-menu-items">
                    <button class="dropdown-menu-item danger" id="logoutMenuItemMini">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                            <polyline points="16 17 21 12 16 7"/>
                            <line x1="21" y1="12" x2="9" y2="12"/>
                        </svg>
                        <span class="menu-item-text">${t('logout')}</span>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    updateMiniUserInfo(user);
    renderMiniAppsGrid();
    setupMiniTrigger(user);

    const overlay  = document.getElementById('mrdevDropdownOverlayMini');
    const dropdown = document.getElementById('mrdevDropdownMini');
    const trigger  = document.getElementById('mrdevUserTriggerMini');

    trigger?.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.contains('show') ? closeMiniDropdown() : openMiniDropdown();
        updateMiniDropdownTexts();
    });

    overlay?.addEventListener('click', closeMiniDropdown);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && dropdown?.classList.contains('show')) closeMiniDropdown();
    });

    document.addEventListener('click', function (e) {
        if (dropdown?.classList.contains('show') && !dropdown.contains(e.target) && trigger && !trigger.contains(e.target)) {
            closeMiniDropdown();
        }
    });

    document.getElementById('logoutMenuItemMini')?.addEventListener('click', function () {
        closeMiniDropdown();
        showLogoutModal(1);
    });

    document.addEventListener('languageChanged', () => {
        updateMiniUserInfo(window.currentUser || null);
    });
}

function updateMiniDropdownTexts() {
    const nameEl  = document.getElementById('dropdownNameMini');
    const emailEl = document.getElementById('dropdownEmailMini');
    if (nameEl  && window.currentUser) nameEl.textContent  = window.currentUser.displayName || window.currentUser.email?.split('@')[0] || 'User';
    if (emailEl && window.currentUser) emailEl.textContent = window.currentUser.email || '';
}

function updateMiniUserInfo(user) {
    const avatar     = document.getElementById('dropdownAvatarMini');
    const name       = document.getElementById('dropdownNameMini');
    const email      = document.getElementById('dropdownEmailMini');
    const logoutMini = document.getElementById('logoutMenuItemMini');

    if (user) {
        const displayName = user.displayName || user.email?.split('@')[0] || 'User';
        if (avatar) {
            avatar.innerHTML = user.photoURL
                ? `<img src="${user.photoURL}" alt="${displayName}">`
                : displayName.charAt(0).toUpperCase();
        }
        if (name)  name.textContent  = displayName;
        if (email) email.textContent = user.email || '';
        if (logoutMini) logoutMini.style.display = 'flex';
    } else {
        if (avatar) avatar.textContent = '?';
        if (name)   name.textContent   = t('guest');
        if (email)  email.textContent  = t('login');
        if (logoutMini) logoutMini.style.display = 'none';
    }
}

function renderMiniAppsGrid() {
    const container = document.getElementById('dropdownAppsMini');
    if (!container) return;
    const allApps = [...APPS_LIST.popular, ...APPS_LIST.mini];
    container.innerHTML = `
        <div class="dropdown-apps-grid-mini">
            ${allApps.map(app => `
                <a href="${app.path}" class="dropdown-app-grid-item-mini" title="${app.name}">
                    ${getAppIconHTML(app, 'large')}
                    <span class="dropdown-app-grid-name-mini">${app.name}</span>
                </a>
            `).join('')}
        </div>
    `;
    attachIconFallbacks(container);
}

function setupMiniTrigger(user) {
    const trigger = document.getElementById('mrdevUserTriggerMini');
    if (!trigger) return;

    if (!user) {
        setTriggerLoading(trigger, false);
        const tName = trigger.querySelector('.trigger-name');
        if (tName) tName.textContent = t('guest');
        return;
    }

    const displayName = user.displayName || user.email?.split('@')[0] || 'User';
    const photoHTML   = user.photoURL
        ? `<img src="${user.photoURL}" alt="${displayName}">`
        : displayName.charAt(0).toUpperCase();

    const tAvatar = trigger.querySelector('.trigger-avatar, .header-user-avatar');
    const tName   = trigger.querySelector('.trigger-name, .header-user-name');
    const tRole   = trigger.querySelector('.trigger-role, .header-user-role');

    if (tAvatar) tAvatar.innerHTML = photoHTML;
    if (tName)   tName.textContent = displayName;
    if (tRole)   tRole.textContent = 'MRDEV';

    setTriggerLoading(trigger, false);
}

function openMiniDropdown() {
    document.getElementById('mrdevDropdownOverlayMini')?.classList.add('show');
    document.getElementById('mrdevDropdownMini')?.classList.add('show');
}

function closeMiniDropdown() {
    document.getElementById('mrdevDropdownOverlayMini')?.classList.remove('show');
    document.getElementById('mrdevDropdownMini')?.classList.remove('show');
}

// ====================================================================
//  MINI APPS AUTH HELPER — localStorage fallback
// ====================================================================
export function getMiniUserFromLocalStorage() {
    try {
        const raw = localStorage.getItem('mrdev_local_auth');
        if (!raw) return null;
        const data = JSON.parse(raw);
        if (!data?.isLoggedIn || !data?.uid || !data?.email) return null;
        const ageDays = (Date.now() - (data.loginTime || 0)) / (1000 * 60 * 60 * 24);
        if (ageDays > 7) return null;
        return {
            uid:         data.uid,
            email:       data.email,
            displayName: data.displayName || data.email.split('@')[0] || 'User',
            photoURL:    data.photoURL || null,
            mrdevId:     data.mrdevId || localStorage.getItem('mrdev_user_id') || '',
            isAuthenticated: true
        };
    } catch (e) {
        return null;
    }
}

export { openRootDropdown as openDropdown, closeRootDropdown as closeDropdown };
