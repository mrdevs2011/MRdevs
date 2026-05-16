// ==================== MRDEV SIDEBAR MANAGER v3.1 ====================
// logger.js olib tashlandi - to'g'ridan-to'g'ri ishlaydi

import { t } from '../core/i18n.js';

export function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}

export function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('show');
}

export function initSidebar() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSidebar();
        }
    });

    // Dastlabki matnlarni qo'llash
    updateSidebarTexts();

    // Til o'zgarganda sidebar matnlarini yangilash
    document.addEventListener('languageChanged', () => {
        updateSidebarTexts();
    });
}

function updateSidebarTexts() {
    const navAll = document.querySelector('#navAll .nav-text');
    const navPopular = document.querySelector('#navPopular .nav-text');
    const navMini = document.querySelector('#navMini .nav-text');
    const notifNav = document.querySelector('#notifNav .nav-text');
    const logoutBtn = document.getElementById('sidebarLogout');
    const loginBtn = document.querySelector('.login-sidebar-btn');

    if (navAll) navAll.textContent = t('all_apps');
    if (navPopular) navPopular.textContent = t('popular_apps');
    if (navMini) navMini.textContent = t('mini_apps');
    if (notifNav) notifNav.textContent = t('pass_notifications');

    if (logoutBtn) {
        // SVG ni saqlagan holda matnni yangilash
        const textNode = logoutBtn.childNodes[logoutBtn.childNodes.length - 1];
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = ' ' + t('logout');
        }
    }

    if (loginBtn) {
        const textNode = loginBtn.childNodes[loginBtn.childNodes.length - 1];
        if (textNode && textNode.nodeType === Node.TEXT_NODE) {
            textNode.textContent = ' ' + t('login');
        }
    }
}