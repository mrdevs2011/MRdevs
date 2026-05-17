// ==================== MRDEV DROPDOWN SYSTEM v8.0 ====================
// Har bir bo'lim (root / mini / settings) uchun alohida dropdown kontenti.
// Header vizuali o'zgarmaydi — faqat dropdown ichidagi kontent o'zgaradi.
// Yagona trigger: #headerUserTrigger
// Avtomatik bo'lim aniqlash: detectSection() → URL ga qarab

import { showPassNotifications }           from './features/pass-notifications.js';
import { logout }                           from './core/auth.js';
import { getAllAccounts }                   from './core/multi-account.js';
import { t }                               from './core/i18n.js';
import { sanitizeURL, sanitizeText, setAvatarSafe, avatarHTMLSafe } from './core/sanitize.js';
import {
    detectSection,
    getBasePath,
    getAppsConfig,
    getProviderInfo,
    getDeviceDisplay,
    Icons,
} from './dropdownConfig.js';

// =====================================================================
// INTERNAL STATE
// =====================================================================

const BASE    = getBasePath();
const APPS    = getAppsConfig(BASE);
const SECTION = detectSection();

let _dropdownId  = null;   // Joriy dropdown element ID
let _overlayId   = null;   // Joriy overlay ID
let _isOpen      = false;
let _logoutTapCount = 0;    // Tap sanagich (swipe yo'q bosishlar)
let _logoutHintTimer = null; // Hint yashirish uchun
let _currentUser = null;   // languageChanged uchun so'nggi user holati

// Hover timerlari — bindTrigger va bindDropdownHover o'rtasida ulashiladi
let _openTimer  = null;
let _closeTimer = null;

// =====================================================================
// TRIGGER UTILS — HEADER O'ZGARMAYDI
// =====================================================================

export function setTriggerLoading(el, isLoading) {
    const t = typeof el === 'string' ? document.getElementById(el) : el;
    if (!t) return;
    if (isLoading) {
        t.classList.add('is-loading');
        return;
    }
    t.classList.remove('is-loading');
    const av   = t.querySelector('.header-user-avatar');
    const info = t.querySelector('.header-user-info');
    if (av)   { av.classList.add('auth-reveal');   setTimeout(() => av.classList.remove('auth-reveal'),   600); }
    if (info) { info.classList.add('auth-reveal'); setTimeout(() => info.classList.remove('auth-reveal'), 600); }
}

export function setDropdownLoading(id, v) {
    document.getElementById(id)?.classList.toggle('is-loading', v);
}

function updateTrigger(user) {
    const trigger = document.getElementById('headerUserTrigger');
    if (!trigger) return;
    const av = trigger.querySelector('.header-user-avatar');
    const nm = trigger.querySelector('.header-user-name');
    if (!user || !user.isAuthenticated) {
        if (av) av.textContent = '?';
        if (nm) nm.textContent = 'Mehmon';
    } else {
        const dn = user.displayName || user.email?.split('@')[0] || 'User';
        if (av) setAvatarSafe(av, user.photoURL, dn.charAt(0).toUpperCase());
        if (nm) nm.textContent = dn;
    }
    setTriggerLoading(trigger, false);
}

// =====================================================================
// OPEN / CLOSE
// =====================================================================

function openDropdown() {
    if (!_dropdownId) return;
    document.getElementById(_overlayId)?.classList.add('show');
    document.getElementById(_dropdownId)?.classList.add('show');
    _isOpen = true;
    resetLogoutBtn();
}

function closeDropdown() {
    if (!_dropdownId) return;
    document.getElementById(_overlayId)?.classList.remove('show');
    document.getElementById(_dropdownId)?.classList.remove('show');
    _isOpen = false;
    resetLogoutBtn();
}

function toggleDropdown() {
    _isOpen ? closeDropdown() : openDropdown();
}

function scheduleOpen() {
    clearTimeout(_closeTimer);
    if (_isOpen) return;
    _openTimer = setTimeout(openDropdown, 80);
}

function scheduleClose() {
    clearTimeout(_openTimer);
    _closeTimer = setTimeout(() => {
        const ddEl = document.getElementById(_dropdownId);
        const trEl = document.getElementById('headerUserTrigger');
        if (!ddEl?.matches(':hover') && !trEl?.matches(':hover')) closeDropdown();
    }, 250);
}

// Dropdown element'iga hover listener'larini ulaydi.
// Trigger qayta klonlanmasdan, faqat dropdown yangilanganda ham chaqiriladi.
function bindDropdownHover() {
    const ddEl = document.getElementById(_dropdownId);
    if (!ddEl) return;
    ddEl.addEventListener('mouseenter', () => clearTimeout(_closeTimer));
    ddEl.addEventListener('mouseleave', scheduleClose);
}

function bindTrigger() {
    const oldTrigger = document.getElementById('headerUserTrigger');
    if (!oldTrigger) return;

    // Eski listener'larni tozalash uchun klonlash
    const trigger = oldTrigger.cloneNode(true);
    oldTrigger.parentNode.replaceChild(trigger, oldTrigger);

    // ── Trigger hover ────────────────────────────────────────
    trigger.addEventListener('mouseenter', scheduleOpen);
    trigger.addEventListener('mouseleave', scheduleClose);

    // ── Dropdown hover ───────────────────────────────────────
    bindDropdownHover();

    // ── Click (mobil + klaviatura uchun) ────────────────────
    trigger.addEventListener('click', e => {
        e.stopPropagation();
        clearTimeout(_openTimer);
        clearTimeout(_closeTimer);
        toggleDropdown();
    });

    // ── Overlay click ────────────────────────────────────────
    document.getElementById(_overlayId)?.addEventListener('click', closeDropdown);

    // ── Escape ───────────────────────────────────────────────
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && _isOpen) closeDropdown();
    });

    // ── Tashqi click (mobil / touch) ─────────────────────────
    document.addEventListener('click', e => {
        const dd = document.getElementById(_dropdownId);
        const tr = document.getElementById('headerUserTrigger');
        if (_isOpen && dd && tr && !dd.contains(e.target) && !tr.contains(e.target)) {
            closeDropdown();
        }
    });
}

// =====================================================================
// AVATAR HTML HELPER
// =====================================================================

// avatarHTMLSafe (core/sanitize.js) dan re-export — mahalliy alias
function avatarHTML(user, size = 44) {
    return avatarHTMLSafe(user, size);
}

// =====================================================================
// APP ICON HELPER
// =====================================================================

function appIconHTML(app, size = 44) {
    const imgSize = Math.round(size * 0.54);
    return `<div class="cfg-app-icon" style="width:${size}px;height:${size}px;">
        <img src="${BASE}/assets/favicons/${app.icon}.svg"
             alt="${app.name}"
             data-fb="${app.name.substring(0, 2).toUpperCase()}"
             style="width:${imgSize}px;height:${imgSize}px;">
    </div>`;
}

function attachFallbacks(el) {
    el.querySelectorAll('img[data-fb]').forEach(img => {
        img.addEventListener('error', function () {
            const fb = this.getAttribute('data-fb') || '??';
            const p  = this.parentElement;
            p.innerHTML = `<span style="font-size:11px;font-weight:700;color:var(--text-3);">${fb}</span>`;
            p.style.cssText += ';display:flex;align-items:center;justify-content:center;';
        });
    });
}

// =====================================================================
// LOGOUT — ODDIY SILLIQ TUGMA
// =====================================================================

function resetLogoutBtn() {
    clearTimeout(_logoutHintTimer);
    _logoutTapCount = 0;
    const btn = document.getElementById('cfg-logout-btn');
    if (!btn) return;
    btn.classList.remove('is-leaving');
    btn.disabled = false;
}

function doLogout() {
    closeDropdown();
    const trigger = document.getElementById('headerUserTrigger');
    if (trigger) trigger.classList.add('is-loading');
    logout();
}

function bindLogoutBtn(btn) {
    if (!btn || btn._logoutBound) return;
    btn._logoutBound = true;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (btn.disabled) return;
        // Tugmani bloklash + animatsiya
        btn.disabled = true;
        btn.classList.add('is-leaving');
        // 320ms animatsiya tugagandan so'ng logout
        setTimeout(doLogout, 320);
    });
}

// =====================================================================
// ─── 1. ROOT DROPDOWN ────────────────────────────────────────────────
// Foydalanuvchi ma'lumotlari + Bildirishnomalar + Haqida + Sozlamalar + Logout
// =====================================================================

function buildRootHTML(user) {
    const dn  = user?.displayName || user?.email?.split('@')[0] || 'Mehmon';
    const uid = user?.mrdevId || localStorage.getItem('mrdev_user_id') || '';
    const isAuth = user?.isAuthenticated;

    return `
    <div class="cfg-overlay" id="cfg-overlay"></div>
    <div class="cfg-dropdown cfg-root" id="cfg-dropdown" role="dialog" aria-modal="true">

        <!-- Profile block -->
        <div class="cfg-profile-block">
            <div class="cfg-avatar cfg-avatar-md" id="cfg-root-avatar">
                ${avatarHTML(user, 48)}
            </div>
            <div class="cfg-profile-meta">
                <div class="cfg-profile-name" id="cfg-root-name">${dn}</div>
                ${uid ? `<div class="cfg-profile-id">MRDEV <span>#${uid}</span></div>` : ''}
                ${user?.email ? `<div class="cfg-profile-email">${user.email}</div>` : ''}
            </div>
        </div>

        <!-- Menu items -->
        <div class="cfg-menu">

            <button class="cfg-item" id="cfg-notif-btn">
                <span class="cfg-item-icon cfg-icon-bell">${Icons.bell}</span>
                <span class="cfg-item-text">Bildirishnomalar</span>
                <span class="cfg-item-badge" id="cfg-notif-badge" style="display:none;"></span>
            </button>

            <button class="cfg-item" id="cfg-about-btn">
                <span class="cfg-item-icon cfg-icon-info">${Icons.info}</span>
                <span class="cfg-item-text">Loyiha haqida</span>
            </button>

            <a href="${BASE}/settings/" class="cfg-item">
                <span class="cfg-item-icon cfg-icon-settings">${Icons.settings}</span>
                <span class="cfg-item-text">Sozlamalar</span>
                <span class="cfg-item-chevron">${Icons.chevronRight}</span>
            </a>

            ${isAuth ? `
            <div class="cfg-divider"></div>
            <button class="cfg-logout-btn" id="cfg-logout-btn" type="button">
                <span class="cfg-logout-icon">${Icons.logout}</span>
                <span class="cfg-logout-label">Chiqish</span>
            </button>` : ''}

        </div>
    </div>`;
}

function fillRootDynamic(user) {
    const av = document.getElementById('cfg-root-avatar');
    const nm = document.getElementById('cfg-root-name');
    if (av) av.innerHTML = avatarHTML(user, 48);
    if (nm) nm.textContent = user?.displayName || user?.email?.split('@')[0] || 'Mehmon';
}

// =====================================================================
// ─── 2. MINI APPS DROPDOWN ───────────────────────────────────────────
// Foydalanuvchi ma'lumotlari ko'rinmaydi. Faqat ilovalar gridi.
// =====================================================================

function buildMiniHTML() {
    const allApps = [...APPS.popular, ...APPS.mini];

    const popularSection = `
        <div class="cfg-apps-section">
            <div class="cfg-apps-section-label">Asosiy ilovalar</div>
            <div class="cfg-apps-grid">
                ${APPS.popular.map(app => `
                    <a href="${app.path}" class="cfg-app-link" title="${app.name}">
                        ${appIconHTML(app, 44)}
                        <span class="cfg-app-name">${app.name}</span>
                    </a>`).join('')}
            </div>
        </div>`;

    const miniSection = `
        <div class="cfg-apps-section">
            <div class="cfg-apps-section-label">Yordamchi ilovalar</div>
            <div class="cfg-apps-grid cfg-apps-grid-compact">
                ${APPS.mini.map(app => `
                    <a href="${app.path}" class="cfg-app-link" title="${app.name}">
                        ${appIconHTML(app, 40)}
                        <span class="cfg-app-name">${app.name}</span>
                    </a>`).join('')}
            </div>
        </div>`;

    return `
    <div class="cfg-overlay" id="cfg-overlay"></div>
    <div class="cfg-dropdown cfg-mini" id="cfg-dropdown" role="dialog" aria-modal="true">

        <div class="cfg-mini-header">
            <span class="cfg-mini-title">Ilovalar</span>
            <a href="${BASE}/" class="cfg-mini-all-link">
                Barchasi
                ${Icons.chevronRight}
            </a>
        </div>

        <div class="cfg-mini-body" id="cfg-mini-body">
            ${popularSection}
            ${miniSection}
        </div>

    </div>`;
}

// =====================================================================
// ─── 3. SETTINGS DROPDOWN ────────────────────────────────────────────
// Katta avatar + Name → Email → MRDEV ID + Qurilmalar + Notif + Logout
// =====================================================================

function buildSettingsHTML(user) {
    const dn    = user?.displayName || user?.email?.split('@')[0] || 'Mehmon';
    const uid   = user?.mrdevId || localStorage.getItem('mrdev_user_id') || '';
    const isAuth = user?.isAuthenticated;

    // Ulangan hisoblar ro'yxati
    const accounts = getAllAccounts();
    let accountsHTML = '';
    if (!accounts.length) {
        accountsHTML = `<div class="cfg-devices-empty">${t('no_connected_accounts')}</div>`;
    } else {
        accountsHTML = accounts.map(acc => {
            const accDn    = acc.displayName || acc.email?.split('@')[0] || t('user_role');
            const pInfo    = getProviderInfo(acc.provider);
            const isActive  = acc.uid === user?.uid;
            const safeSrc   = sanitizeURL(acc.photoURL);
            const safeAlt   = sanitizeText(accDn);
            const safeAccDn = sanitizeText(accDn);
            const accAv     = safeSrc
                ? `<img src="${safeSrc}" alt="${safeAlt}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
                : `<span>${sanitizeText(accDn.charAt(0).toUpperCase())}</span>`;

            return `<div class="cfg-device-item${isActive ? ' cfg-device-active' : ''}">
                <div class="cfg-device-av">${accAv}</div>
                <div class="cfg-device-info">
                    <div class="cfg-device-name">${safeAccDn}</div>
                    <div class="cfg-device-meta">
                        <span class="cfg-provider-tag" style="--p-color:${sanitizeText(pInfo.color)};">
                            ${pInfo.icon}${sanitizeText(pInfo.label)}
                        </span>
                    </div>
                </div>
                ${isActive ? `<span class="cfg-device-check">${Icons.check}</span>` : ''}
            </div>`;
        }).join('');
    }

    return `
    <div class="cfg-overlay" id="cfg-overlay"></div>
    <div class="cfg-dropdown cfg-settings" id="cfg-dropdown" role="dialog" aria-modal="true">

        <!-- Katta profil avatar + info -->
        <div class="cfg-settings-profile">
            <div class="cfg-settings-avatar-wrap">
                <div class="cfg-avatar cfg-avatar-lg" id="cfg-settings-avatar">
                    ${avatarHTML(user, 68)}
                </div>
                <div class="cfg-settings-avatar-ring"></div>
            </div>
            <div class="cfg-settings-name"   id="cfg-settings-name">${dn}</div>
            ${user?.email ? `<div class="cfg-settings-email" id="cfg-settings-email">${user.email}</div>` : ''}
            ${uid ? `<div class="cfg-settings-id">MRDEV <span class="cfg-settings-id-num">#${uid}</span></div>` : ''}
        </div>

        <!-- Ulangan qurilmalar / hisoblar -->
        <div class="cfg-section">
            <div class="cfg-section-title">
                ${Icons.shield}
                ${t('connected_accounts')}
            </div>
            <div class="cfg-devices-list" id="cfg-devices-list">
                ${accountsHTML}
            </div>
        </div>

        <div class="cfg-divider"></div>

        <!-- Bildirishnomalar + Logout -->
        <div class="cfg-menu">

            <button class="cfg-item" id="cfg-notif-btn">
                <span class="cfg-item-icon cfg-icon-bell">${Icons.bell}</span>
                <span class="cfg-item-text">Bildirishnomalar</span>
            </button>

            ${isAuth ? `
            <div class="cfg-divider"></div>
            <button class="cfg-logout-btn" id="cfg-logout-btn" type="button">
                <span class="cfg-logout-icon">${Icons.logout}</span>
                <span class="cfg-logout-label">Chiqish</span>
            </button>` : ''}

        </div>
    </div>`;
}

function fillSettingsDynamic(user) {
    const av = document.getElementById('cfg-settings-avatar');
    const nm = document.getElementById('cfg-settings-name');
    const em = document.getElementById('cfg-settings-email');
    if (av) av.innerHTML = avatarHTML(user, 68);
    if (nm) nm.textContent = user?.displayName || user?.email?.split('@')[0] || 'Mehmon';
    if (em && user?.email) em.textContent = user.email;

    // Hisoblarni yangilash
    const list = document.getElementById('cfg-devices-list');
    if (!list) return;
    const accounts = getAllAccounts();
    if (!accounts.length) {
        list.innerHTML = `<div class="cfg-devices-empty">${t('no_connected_accounts')}</div>`;
        return;
    }
    list.innerHTML = accounts.map(acc => {
        const accDn     = acc.displayName || acc.email?.split('@')[0] || t('user_role');
        const pInfo     = getProviderInfo(acc.provider);
        const isActive  = acc.uid === user?.uid;
        const safeSrc   = sanitizeURL(acc.photoURL);
        const safeAlt   = sanitizeText(accDn);
        const safeAccDn = sanitizeText(accDn);
        const accAv     = safeSrc
            ? `<img src="${safeSrc}" alt="${safeAlt}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
            : `<span>${sanitizeText(accDn.charAt(0).toUpperCase())}</span>`;
        return `<div class="cfg-device-item${isActive ? ' cfg-device-active' : ''}">
            <div class="cfg-device-av">${accAv}</div>
            <div class="cfg-device-info">
                <div class="cfg-device-name">${safeAccDn}</div>
                <div class="cfg-device-meta">
                    <span class="cfg-provider-tag" style="--p-color:${sanitizeText(pInfo.color)};">
                        ${pInfo.icon}${sanitizeText(pInfo.label)}
                    </span>
                </div>
            </div>
            ${isActive ? `<span class="cfg-device-check">${Icons.check}</span>` : ''}
        </div>`;
    }).join('');
}

// =====================================================================
// EVENT LISTENERS — SECTION QA QARAB
// =====================================================================

function attachEvents(section) {
    const notifBtn  = document.getElementById('cfg-notif-btn');
    const logoutBtn = document.getElementById('cfg-logout-btn');
    const aboutBtn  = document.getElementById('cfg-about-btn');

    notifBtn?.addEventListener('click', () => {
        closeDropdown();
        // Settings sahifasida modal bo'lmasa — dinamik yaratamiz
        ensurePassNotifModal();
        showPassNotifications();
    });

    aboutBtn?.addEventListener('click', () => {
        closeDropdown();
        // About sahifasiga o'tish
        window.location.href = BASE + '/about/';
    });

    if (logoutBtn) bindLogoutBtn(logoutBtn);
}

// passNotifModal DOM da bo'lmasa — dinamik qo'shamiz
function ensurePassNotifModal() {
    if (document.getElementById('passNotifModal')) return;
    const modal = document.createElement('div');
    modal.id = 'passNotifModal';
    modal.className = 'modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content" style="max-width:450px;">
            <div class="modal-header">
                <h3 data-i18n="pass_notifications">Parol xabarlari</h3>
                <button class="modal-close" onclick="closePassNotifModal()" data-i18n="close">✕</button>
            </div>
            <div class="modal-body" id="passNotifList" style="max-height:60vh;overflow-y:auto;">
                <div style="text-align:center;padding:20px;color:var(--text-3);">Yuklanmoqda...</div>
            </div>
        </div>`;
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            import('./ui/modal.js').then(m => m.closeModal('passNotifModal'));
        }
    });
    document.body.appendChild(modal);
    // closePassNotifModal global funksiyasi
    if (!window.closePassNotifModal) {
        window.closePassNotifModal = () => {
            import('./ui/modal.js').then(m => m.closeModal('passNotifModal'));
        };
    }
}

// =====================================================================
// INJECT — DOM'ga bir marta qo'shiladi
// =====================================================================

function injectDropdown(user) {
    _currentUser = user;
    // Mavjud elementlarni tozalash
    document.getElementById('cfg-dropdown')?.remove();
    document.getElementById('cfg-overlay')?.remove();

    let html = '';
    if (SECTION === 'mini') {
        html = buildMiniHTML();
    } else if (SECTION === 'settings') {
        html = buildSettingsHTML(user);
    } else {
        html = buildRootHTML(user);
    }

    document.body.insertAdjacentHTML('beforeend', html);
    _dropdownId = 'cfg-dropdown';
    _overlayId  = 'cfg-overlay';

    // Mini apps uchun fallback rasmlar
    if (SECTION === 'mini') {
        const body = document.getElementById('cfg-mini-body');
        if (body) attachFallbacks(body);
    }

    attachEvents(SECTION);
    bindTrigger();
}

// =====================================================================
// ASOSIY EXPORT FUNKSIYALARI
// =====================================================================

/**
 * Root bo'limi uchun dropdown
 */
export function initRootDropdown(user) {
    injectDropdown(user);
    updateTrigger(user);
}

/**
 * Mini apps bo'limi uchun dropdown
 */
export function initMiniDropdown(user) {
    injectDropdown(user);
    updateTrigger(user);
}

/**
 * Settings bo'limi uchun dropdown
 */
export function initSettingsDropdown(user) {
    injectDropdown(user);
    updateTrigger(user);
}

/**
 * Avtomatik bo'lim aniqlash va dropdown init
 * Eng qulay usul — barcha sahifalarda shu bitta funksiyani chaqirish yetarli.
 */
export function initDropdownAuto(user) {
    if (SECTION === 'mini')     return initMiniDropdown(user);
    if (SECTION === 'settings') return initSettingsDropdown(user);
    return initRootDropdown(user);
}

/**
 * Foydalanuvchi ma'lumotlari yangilanganda (auth state o'zgarganda) chaqiriladi.
 */
export function updateDropdown(user) {
    updateTrigger(user);

    // Agar dropdown allaqachon ochiq bo'lsa, dinamik yangilash
    if (!document.getElementById('cfg-dropdown')) {
        injectDropdown(user);
        return;
    }

    if (SECTION === 'settings') {
        fillSettingsDynamic(user);
    } else if (SECTION === 'root') {
        fillRootDynamic(user);
    }
    // mini uchun user ma'lumoti ko'rinmaydi, yangilash shart emas
}

// =====================================================================
// BACKWARD COMPAT EXPORTS
// =====================================================================

export { initRootDropdown as initDropdown };

export function showLogoutModal() {
    const btn = document.getElementById('cfg-logout-btn');
    if (btn) bindLogoutBtn(btn);
}

export function closeAllLogoutModals() {
    resetLogoutBtn();
}

export function getMiniUserFromLocalStorage() {
    try {
        const raw = localStorage.getItem('mrdev_local_auth');
        if (!raw) return null;
        const d = JSON.parse(raw);
        if (!d?.isLoggedIn || !d?.uid || !d?.email) return null;
        if ((Date.now() - (d.loginTime || 0)) / 86400000 > 7) return null;
        return {
            uid:             d.uid,
            email:           d.email,
            displayName:     d.displayName || d.email.split('@')[0] || 'User',
            photoURL:        d.photoURL || null,
            mrdevId:         d.mrdevId || localStorage.getItem('mrdev_user_id') || '',
            isAuthenticated: true,
        };
    } catch (e) {
        return null;
    }
}

// =====================================================================
// TIL O'ZGARGANDA DROPDOWN KONTENTINI YANGILASH
// =====================================================================

/**
 * Header triggerini qayta klonlamasdan faqat dropdown ichki
 * kontentini qayta quradi. Hover/click logikasi saqlanib qoladi,
 * chunki modul darajasidagi _openTimer/_closeTimer va ID-based
 * getElementById referenslar yangi element uchun ham to'g'ri ishlaydi.
 */
function refreshDropdownContent() {
    if (!document.getElementById('cfg-dropdown')) return;

    const wasOpen = _isOpen;

    // Avval ochiq holatni yopdik (animatsiyasiz — class olib tashlanadi)
    document.getElementById(_overlayId)?.classList.remove('show');
    document.getElementById(_dropdownId)?.classList.remove('show');
    _isOpen = false;

    // Eski dropdown va overlay ni olib tashlaymiz
    document.getElementById('cfg-dropdown')?.remove();
    document.getElementById('cfg-overlay')?.remove();

    // Joriy seksiya uchun yangi HTML ni quramiz
    let html = '';
    if (SECTION === 'mini') {
        html = buildMiniHTML();
    } else if (SECTION === 'settings') {
        html = buildSettingsHTML(_currentUser);
    } else {
        html = buildRootHTML(_currentUser);
    }

    document.body.insertAdjacentHTML('beforeend', html);
    _dropdownId = 'cfg-dropdown';
    _overlayId  = 'cfg-overlay';

    // Mini ilovalar uchun fallback rasmlarni qayta ulash
    if (SECTION === 'mini') {
        const body = document.getElementById('cfg-mini-body');
        if (body) attachFallbacks(body);
    }

    // Event listener'larni qayta ulash
    attachEvents(SECTION);
    document.getElementById(_overlayId)?.addEventListener('click', closeDropdown);

    // Dropdown hover listener'larini qayta ulash (trigger qayta klonlanmaydi)
    bindDropdownHover();

    // Agar oldin ochiq bo'lsa, qayta ochamiz
    if (wasOpen) openDropdown();
}

// Boshqa fayllar kabi (account-switcher.js, sidebar.js, email-auth.js va b.)
// til o'zgarganda dropdown kontentini yangilaymiz.
document.addEventListener('languageChanged', () => {
    refreshDropdownContent();
});