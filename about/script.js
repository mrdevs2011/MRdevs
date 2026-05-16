// ==================== MRDEV ABOUT PAGE — GLOBAL TIZIM BILAN INTEGRASİYA ====================

import { initTheme, toggleTheme } from '../assets/js/core/theme.js';
import { initAuth, logout, getCurrentUser } from '../assets/js/core/auth.js';
import { toggleSidebar, closeSidebar, initSidebar } from '../assets/js/ui/sidebar.js';
import { initModals, showModal, closeModal } from '../assets/js/ui/modal.js';
import { initUserMenu, updateUserMenuForUser, toggleUserMenu, closeUserMenu } from '../assets/js/ui/user-menu.js';
import { signInWithGoogle } from '../assets/js/features/google-auth.js';
import { showMrdevLogin, closeMrdevLoginModal, submitMrdevId, verifyMrdevPass } from '../assets/js/features/mrdev-login.js';
import { showPassNotifications, closePassNotifModal } from '../assets/js/features/pass-notifications.js';
import { setAuthMode, toggleAuthMode, signInWithEmail, signUpWithEmail, submitAuthForm } from '../assets/js/features/email-auth.js';
import { initDropdown, updateDropdown, setTriggerLoading } from '../assets/js/dropdown.js';
import { showToast } from '../assets/js/core/toast.js';
import { initI18n, setLanguage, t } from '../assets/js/core/i18n.js';
import { autoDetectLanguage } from '../assets/js/core/geo-lang.js';
import { initGlobalSettings } from '../assets/js/core/global-settings.js';

// ==================== WINDOW EXPORTS (global funksiyalar) ====================
window.toggleTheme = toggleTheme;
window.toggleSidebar = toggleSidebar;
window.closeSidebar = closeSidebar;
window.logout = logout;
window.showAuthModal = () => showModal('authModal');
window.closeAuthModal = () => closeModal('authModal');
window.signInWithGoogle = signInWithGoogle;
window.showMrdevLogin = showMrdevLogin;
window.closeMrdevLoginModal = closeMrdevLoginModal;
window.submitMrdevId = submitMrdevId;
window.verifyMrdevPass = verifyMrdevPass;
window.showPassNotifications = showPassNotifications;
window.closePassNotifModal = closePassNotifModal;
window.setAuthMode = setAuthMode;
window.toggleAuthMode = toggleAuthMode;
window.signInWithEmail = signInWithEmail;
window.signUpWithEmail = signUpWithEmail;
window.submitAuthForm = submitAuthForm;
window.toggleUserMenu = toggleUserMenu;
window.closeUserMenu = closeUserMenu;

// ==================== VOSITALAR RO'YXATI ====================
const toolsList = [
    { name: "MR Vault", desc: "Shaxsiy fayl ombori — 50 MB gacha", cat: "storage", icon: "📦" },
    { name: "Examer", desc: "Professional test va imtihon yaratuvchi", cat: "edu", icon: "📝" },
    { name: "Group Board", desc: "Real vaqt hamkorlik uchun doska", cat: "productivity", icon: "🎨" },
    { name: "Code Studio", desc: "Brauzerda to'liq kod muharriri", cat: "dev", icon: "💻" },
    { name: "MR Gram", desc: "MR Dev ichidagi ijtimoiy tarmoq", cat: "fun", icon: "📱" },
    { name: "MR AI Assistant", desc: "Sun'iy idrok yordamchisi", cat: "dev", icon: "🤖" },
    { name: "Notes", desc: "Markdown qo'llab-quvvatlovchi eslatmalar", cat: "productivity", icon: "📓" },
    { name: "Timer", desc: "Pomodoro va oddiy taymer", cat: "productivity", icon: "⏱️" },
    { name: "Typing Test", desc: "Yozish tezligi sinovi (WPM)", cat: "edu", icon: "⌨️" },
    { name: "Security", desc: "Parol generatori va hash", cat: "dev", icon: "🔐" },
    { name: "Weather", desc: "Real vaqt ob-havo", cat: "productivity", icon: "🌤️" },
    { name: "QR Generator", desc: "QR kod yaratuvchi", cat: "dev", icon: "📱" },
    { name: "Calculator", desc: "Ilmiy kalkulyator", cat: "mini", icon: "🔢" },
    { name: "Bingo", desc: "Bingo o'yini (2 o'yinchi yoki bot)", cat: "fun", icon: "🎲" },
    { name: "Board", desc: "Oddiy doska", cat: "mini", icon: "📋" },
    { name: "Music", desc: "Audio yozish va saqlash", cat: "fun", icon: "🎵" },
    { name: "SplitView", desc: "Yonma-yon video ko'rish", cat: "productivity", icon: "🖥️" },
    { name: "Clock", desc: "Soat va budilnik", cat: "mini", icon: "🕐" },
    { name: "Stopwatch", desc: "Sekundomer", cat: "mini", icon: "⏱️" },
    { name: "Todo", desc: "Kun tartibi", cat: "productivity", icon: "✅" },
    { name: "NotifyHub", desc: "Bildirishnomalar markazi", cat: "productivity", icon: "🔔" },
    { name: "VideoHub", desc: "Videolar ombori", cat: "storage", icon: "🎬" }
];

function renderTools() {
    const container = document.getElementById('toolsGrid');
    if (!container) return;
    
    container.innerHTML = toolsList.map(tool => `
        <div class="tool-card-mini" data-category="${tool.cat}">
            <div class="tool-icon">${tool.icon}</div>
            <div class="tool-info">
                <h4>${tool.name}</h4>
                <p>${tool.desc}</p>
            </div>
        </div>
    `).join('');
}

// ==================== STAT COUNTER ANIMATION ====================
function animateNumber(element, target, duration = 1500) {
    if (!element) return;
    let start = 0;
    const step = target / (duration / 16);
    const update = () => {
        start += step;
        if (start >= target) {
            element.textContent = target;
            return;
        }
        element.textContent = Math.floor(start);
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

function initCounters() {
    const toolsEl = document.getElementById('statTools');
    const freeEl = document.getElementById('statFree');
    const storageEl = document.getElementById('statStorage');
    const encryptEl = document.getElementById('statEncrypt');
    
    if (toolsEl) animateNumber(toolsEl, 22, 1200);
    if (freeEl) animateNumber(freeEl, 100, 1200);
    if (storageEl) animateNumber(storageEl, 50, 1200);
    if (encryptEl) animateNumber(encryptEl, 256, 1200);
}

// ==================== AUTH USER UI UPDATE ====================
function updateUIForUser(user) {
    const sidebarUser = document.getElementById('sidebarUser');
    const sidebarLogin = document.getElementById('sidebarLogin');
    const sidebarLogout = document.getElementById('sidebarLogout');
    const userNameSpan = document.getElementById('sidebarName');
    const userEmailSpan = document.getElementById('sidebarEmail');
    const userMrdevSpan = document.getElementById('sidebarMrdevId');
    const avatar = document.getElementById('sidebarAvatar');
    const headerAvatar = document.getElementById('headerUserAvatar');
    const headerUserName = document.getElementById('headerUserName');
    
    if (user && user.isAuthenticated) {
        const displayName = user.displayName || user.email?.split('@')[0] || 'User';
        const mrdevId = user.mrdevId || localStorage.getItem('mrdev_user_id') || '';
        
        if (sidebarUser) {
            sidebarUser.classList.remove('is-loading');
            sidebarUser.style.display = 'flex';
        }
        if (sidebarLogin) sidebarLogin.style.display = 'none';
        if (sidebarLogout) sidebarLogout.style.display = 'flex';
        
        if (userNameSpan) userNameSpan.textContent = displayName;
        if (userEmailSpan) userEmailSpan.textContent = user.email || '';
        if (userMrdevSpan) userMrdevSpan.textContent = mrdevId ? `MRDEV #${mrdevId}` : '';
        if (avatar) {
            avatar.innerHTML = user.photoURL 
                ? `<img src="${user.photoURL}" style="width:100%;height:100%;object-fit:cover;">` 
                : displayName.charAt(0).toUpperCase();
        }
        if (headerAvatar) {
            headerAvatar.innerHTML = user.photoURL 
                ? `<img src="${user.photoURL}" style="width:100%;height:100%;object-fit:cover;">` 
                : displayName.charAt(0).toUpperCase();
        }
        if (headerUserName) headerUserName.textContent = displayName;
        
        const trigger = document.getElementById('headerUserTrigger');
        if (trigger) trigger.classList.remove('is-loading');
        
        updateDropdown(user);
    } else {
        if (sidebarUser) sidebarUser.style.display = 'none';
        if (sidebarLogin) sidebarLogin.style.display = 'block';
        if (sidebarLogout) sidebarLogout.style.display = 'none';
        if (headerAvatar) headerAvatar.textContent = '?';
        if (headerUserName) headerUserName.textContent = 'Mehmon';
        
        const trigger = document.getElementById('headerUserTrigger');
        if (trigger) trigger.classList.remove('is-loading');
        
        updateDropdown(null);
    }
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
    // Global sozlamalar
    initGlobalSettings();
    initTheme();
    initSidebar();
    initModals();
    initUserMenu();
    
    // Tillar
    initI18n();
    await autoDetectLanguage().catch(() => {});
    
    // Vositalarni render qilish
    renderTools();
    initCounters();
    
    // Auth
    initAuth((user) => {
        updateUIForUser(user);
    });
    
    // Dropdown init (global header trigger uchun)
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.isAuthenticated) {
        initDropdown(currentUser);
        updateUIForUser(currentUser);
    } else {
        initDropdown(null);
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const target = link.getAttribute('href');
            if (target === '#') return;
            const el = document.querySelector(target);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});