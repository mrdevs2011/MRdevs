// ==================== MRDEV USER MENU v2.0 ====================
// i18n va global settings bilan integratsiyalashgan

import { t } from '../core/i18n.js';
import { getNotificationsEnabled } from '../core/global-settings.js';

export function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.toggle('show');
    updateUserMenuTexts();
}

export function closeUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.remove('show');
}

export function initUserMenu() {
    document.addEventListener('click', (e) => {
        const trigger = document.getElementById('mrdevUserTrigger');
        const menu = document.getElementById('userMenu');
        if (trigger && menu && !trigger.contains(e.target) && !menu.contains(e.target)) {
            closeUserMenu();
        }
    });
    
    // User menu dagi matnlarni i18n bilan yangilash
    updateUserMenuTexts();
    
    // Til o'zgarganda user menu matnlarini yangilash
    document.addEventListener('languageChanged', () => {
        updateUserMenuTexts();
    });
}

function updateUserMenuTexts() {
    // User menu linklar
    const allAppsLink = document.querySelector('#userMenu a[onclick*="switchTab(\'all\')"]');
    const popularAppsLink = document.querySelector('#userMenu a[onclick*="switchTab(\'popular\')"]');
    const miniAppsLink = document.querySelector('#userMenu a[onclick*="switchTab(\'mini\')"]');
    const settingsLink = document.querySelector('#userMenu a[href*="./settings/"]');
    const notifLink = document.getElementById('notifMenuLink');
    const logoutBtn = document.getElementById('userMenuLogout');
    const loginBtn = document.querySelector('#userMenuLogin button');
    
    if (allAppsLink) {
        const svg = allAppsLink.querySelector('svg');
        const text = allAppsLink.childNodes[allAppsLink.childNodes.length - 1];
        if (text && text.nodeType === 3) text.textContent = t('all_apps');
    }
    
    if (popularAppsLink) {
        const svg = popularAppsLink.querySelector('svg');
        const text = popularAppsLink.childNodes[popularAppsLink.childNodes.length - 1];
        if (text && text.nodeType === 3) text.textContent = t('popular_apps');
    }
    
    if (miniAppsLink) {
        const svg = miniAppsLink.querySelector('svg');
        const text = miniAppsLink.childNodes[miniAppsLink.childNodes.length - 1];
        if (text && text.nodeType === 3) text.textContent = t('mini_apps');
    }
    
    if (settingsLink) {
        const svg = settingsLink.querySelector('svg');
        const text = settingsLink.childNodes[settingsLink.childNodes.length - 1];
        if (text && text.nodeType === 3) text.textContent = t('settings');
    }
    
    if (notifLink) {
        const svg = notifLink.querySelector('svg');
        const text = notifLink.childNodes[notifLink.childNodes.length - 1];
        if (text && text.nodeType === 3) text.textContent = t('pass_notifications');
    }
    
    if (logoutBtn) {
        const svg = logoutBtn.querySelector('svg');
        logoutBtn.innerHTML = '';
        if (svg) logoutBtn.appendChild(svg);
        logoutBtn.appendChild(document.createTextNode(' ' + t('logout')));
    }
    
    if (loginBtn) {
        const svg = loginBtn.querySelector('svg');
        loginBtn.innerHTML = '';
        if (svg) loginBtn.appendChild(svg);
        loginBtn.appendChild(document.createTextNode(' ' + t('login')));
    }
}