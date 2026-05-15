// ==================== MRDEV USER MENU v2.1 ====================
// i18n va global settings bilan integratsiyalashgan
// FIX v2.1: updateUserMenuTexts() olib tashlandi —
//   HTML da barcha elementlar data-i18n atributiga ega,
//   i18n.js ularni o'zi to'g'ri yangilaydi.
//   updateUserMenuTexts() esa oxirgi whitespace text node ni
//   tarjima matni bilan to'ldirib, ikki marta ko'rinishga olib kelardi.

import logger from '../core/logger.js';

export function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.toggle('show');
}

export function closeUserMenu() {
    const menu = document.getElementById('userMenu');
    if (menu) menu.classList.remove('show');
}

export function initUserMenu() {
    logger.ui.userMenuInit();

    document.addEventListener('click', (e) => {
        const trigger = document.getElementById('mrdevUserTrigger') ||
                        document.getElementById('headerUserTrigger');
        const menu = document.getElementById('userMenu');
        if (trigger && menu && !trigger.contains(e.target) && !menu.contains(e.target)) {
            closeUserMenu();
        }
    });
}
