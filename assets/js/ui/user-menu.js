// ==================== MRDEV USER MENU v3.0 ====================
// initDropdown bilan birgalikda ishlaydi (dropdown.js)
// Bu fayl root header dagi eski user-menu ni boshqaradi (backward compat)
// Asosiy dropdown logikasi dropdown.js da.

import { t } from '../core/i18n.js';
import { sanitizeURL, sanitizeText, setAvatarSafe } from '../core/sanitize.js';

export function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.toggle('show');
    if (menu?.classList.contains('show')) updateUserMenuTexts();
}

export function closeUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.remove('show');
}

export function initUserMenu() {
    // Tashqarida click bo'lganda yopish
    document.addEventListener('click', (e) => {
        const trigger = document.getElementById('headerUserTrigger');
        const menu    = document.getElementById('userMenu');
        if (
            menu?.classList.contains('show') &&
            !menu.contains(e.target) &&
            !trigger?.contains(e.target)
        ) {
            closeUserMenu();
        }
    });

    // Dastlabki matnlarni qo'llash
    updateUserMenuTexts();

    // Til o'zgarganda user menu matnlarini yangilash
    document.addEventListener('languageChanged', () => {
        updateUserMenuTexts();
    });
}

/**
 * User menu dagi foydalanuvchi ma'lumotlarini yangilaydi.
 * auth.js tomonidan chaqiriladi.
 */
export function updateUserMenuForUser(user) {
    const header  = document.getElementById('userMenuHeader');
    const avatar  = document.getElementById('menuAvatar');
    const name    = document.getElementById('menuName');
    const email   = document.getElementById('menuEmail');
    const mrdevId = document.getElementById('menuMrdevId');
    const login   = document.getElementById('userMenuLogin');
    const notif   = document.getElementById('notifMenuLink');

    if (user && user.isAuthenticated) {
        const displayName = user.displayName || user.email?.split('@')[0] || 'User';
        const userId      = user.mrdevId || localStorage.getItem('mrdev_user_id') || '';

        if (header)  header.style.display  = 'flex';
        if (login)   login.style.display   = 'none';
        if (notif)   notif.style.display   = 'flex';

        if (avatar) {
            setAvatarSafe(
                avatar,
                user.photoURL,
                displayName.charAt(0).toUpperCase(),
                'width:100%;height:100%;object-fit:cover;'
            );
        }
        if (name)    name.textContent    = displayName;
        if (email)   email.textContent   = user.email || '';
        if (mrdevId) {
            mrdevId.textContent    = userId ? `#${userId}` : '';
            mrdevId.style.display  = userId ? 'block' : 'none';
        }
    } else {
        if (header)  header.style.display = 'none';
        if (login)   login.style.display  = 'block';
        if (notif)   notif.style.display  = 'none';
        if (avatar)  avatar.textContent   = '?';
    }
}

function updateUserMenuTexts() {
    const allAppsLink    = document.querySelector('#userMenu a[onclick*="switchTab(\'all\')"]');
    const popularLink    = document.querySelector('#userMenu a[onclick*="switchTab(\'popular\')"]');
    const miniLink       = document.querySelector('#userMenu a[onclick*="switchTab(\'mini\')"]');
    const settingsLink   = document.querySelector('#userMenu a[href*="./settings/"]');
    const notifLink      = document.getElementById('notifMenuLink');
    const loginBtn       = document.querySelector('#userMenuLogin button');

    [
        [allAppsLink,  'all_apps'],
        [popularLink,  'popular_apps'],
        [miniLink,     'mini_apps'],
        [settingsLink, 'settings'],
        [notifLink,    'pass_notifications'],
    ].forEach(([el, key]) => {
        if (!el) return;
        const last = el.childNodes[el.childNodes.length - 1];
        if (last?.nodeType === Node.TEXT_NODE) last.textContent = t(key);
    });

    if (loginBtn) {
        const svg = loginBtn.querySelector('svg');
        loginBtn.innerHTML = '';
        if (svg) loginBtn.appendChild(svg);
        loginBtn.appendChild(document.createTextNode(' ' + t('login')));
    }
}