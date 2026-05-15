// ==================== MRDEV LOGIN ADS v2.0 ====================
// i18n bilan integratsiyalashgan
// Desktop: auth modal ichida chap + o'ng panel
// Mobile: faqat auth modal

import { showModal, closeModal } from '../ui/modal.js';
import { t } from '../core/i18n.js';

let adsPanelCreated = false;

export function showAuthWithAds() {
    const isDesktop = window.innerWidth >= 768;

    if (!isDesktop) {
        showModal('authModal');
        return;
    }

    if (!adsPanelCreated) {
        createSplitLayout();
        adsPanelCreated = true;
    }

    showModal('authModal');
}

function createSplitLayout() {
    const authModal = document.getElementById('authModal');
    const modalContent = authModal?.querySelector('.modal-content');
    if (!modalContent) return;

    modalContent.style.maxWidth = '760px';
    modalContent.style.width = '90vw';
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'row';
    modalContent.style.padding = '0';
    modalContent.style.overflow = 'hidden';
    modalContent.style.borderRadius = '20px';
    modalContent.style.minHeight = '560px';

    const leftPanel = document.createElement('div');
    leftPanel.className = 'auth-left-panel';
    leftPanel.style.cssText = `
        flex: 1;
        padding: 36px 32px;
        display: flex;
        flex-direction: column;
        background: var(--surface);
        min-width: 340px;
        overflow-y: auto;
    `;

    const header = modalContent.querySelector('.modal-header');
    const body = modalContent.querySelector('.modal-body');
    if (header) leftPanel.appendChild(header);
    if (body) leftPanel.appendChild(body);

    const rightPanel = document.createElement('div');
    rightPanel.className = 'auth-right-panel';
    rightPanel.style.cssText = `
        flex: 1;
        background: var(--bg);
        display: flex;
        align-items: center;
        justify-content: center;
        border-left: 1px solid var(--border);
        min-width: 340px;
        position: relative;
        overflow: hidden;
        border-radius: 0 20px 20px 0;
    `;

    const iframe = document.createElement('iframe');
    iframe.src = './ads-login.html';
    iframe.style.cssText = `
        width: 100%;
        height: 100%;
        min-height: 560px;
        border: none;
        background: var(--bg);
    `;
    iframe.title = 'MRDEV Platform';
    iframe.loading = 'lazy';

    rightPanel.appendChild(iframe);
    modalContent.innerHTML = '';
    modalContent.appendChild(leftPanel);
    modalContent.appendChild(rightPanel);

    updateAuthModalTexts();
}

function updateAuthModalTexts() {
    const modalTitle = document.querySelector('#authModal .modal-header h3');
    const authToggleText = document.getElementById('authToggleText');
    const authToggleLink = document.getElementById('authToggleLink');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const googleBtn = document.querySelector('.google-auth-btn');
    const mrdevBtn = document.querySelector('.mrdev-auth-btn');

    if (modalTitle) modalTitle.textContent = t('login');
    if (authSubmitBtn) authSubmitBtn.textContent = t('login');
    if (authToggleText) authToggleText.textContent = t('no_account') || "Hisobingiz yo'qmi?";
    if (authToggleLink) authToggleLink.textContent = t('register');
    if (googleBtn) {
        const svg = googleBtn.querySelector('svg');
        googleBtn.innerHTML = '';
        if (svg) googleBtn.appendChild(svg);
        googleBtn.appendChild(document.createTextNode(' ' + t('google_login')));
    }
    if (mrdevBtn) {
        mrdevBtn.innerHTML = '';
        mrdevBtn.appendChild(document.createTextNode(t('mrdev_login')));
    }
}

document.addEventListener('languageChanged', () => {
    updateAuthModalTexts();
});

window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth >= 768;
    const modalContent = document.querySelector('#authModal .modal-content');
    if (!modalContent) return;

    if (!isDesktop) {
        modalContent.style.maxWidth = '380px';
        modalContent.style.width = '100%';
        modalContent.style.display = 'block';
        modalContent.style.flexDirection = '';
        modalContent.style.padding = '';
        modalContent.style.overflow = '';
        modalContent.style.borderRadius = '';
        modalContent.style.minHeight = '';
        adsPanelCreated = false;
    }
});