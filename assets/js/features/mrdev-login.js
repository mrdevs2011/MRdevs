// ==================== MRDEV ID LOGIN v10.0 ====================
// To'liq i18n bilan integratsiyalashgan

import logger from '../core/logger.js';
import { db, rtdb, auth } from '../core/firebase-init.js';
import { ref, push, get, update, set } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';
import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { showToast } from '../core/toast.js';
import { showModal, closeModal } from '../ui/modal.js';
import { loginWithMrdevId, getLinkedAccount } from '../notif-pass.js';
import { t, getCurrentLang } from '../core/i18n.js';

let mrdevLoginTimer = null;
let currentStepData = null;
let isVerifying = false;

function generateSecureOTP() {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return (100000 + (arr[0] % 900000)).toString();
}

function saveLocalAuth(userData) {
    if (!userData || !userData.uid) return;
    localStorage.setItem('mrdev_local_auth', JSON.stringify({
        uid: userData.uid,
        email: userData.email || '',
        displayName: userData.displayName || 'User',
        photoURL: userData.photoURL || null,
        mrdevId: userData.mrdevId || '',
        linkedTo: userData.linkedTo || null,
        provider: 'mrdev',
        authType: 'mrdev',
        isLoggedIn: true,
        loginTime: Date.now()
    }));
    if (userData.mrdevId) localStorage.setItem('mrdev_user_id', userData.mrdevId);
}

function showLoading() {
    document.getElementById('mrdevLoadingOverlay')?.classList.add('show');
}

function hideLoading() {
    const modalBody = document.querySelector('#mrdevLoginModal .modal-body');
    if (modalBody && window.MrdevLoading) window.MrdevLoading.hide(modalBody);
}

function updateMrdevModalTexts() {
    const step1Heading = document.querySelector('#mrdevStep1 .mrdev-heading');
    const step1Subheading = document.querySelector('#mrdevStep1 .mrdev-subheading');
    const step2Heading = document.querySelector('#mrdevStep2 .mrdev-heading');
    const step2Subheading = document.querySelector('#mrdevStep2 .mrdev-subheading');
    const toggleLink1 = document.querySelector('#mrdevStep1 .mrdev-toggle-link');
    const toggleLink2 = document.querySelector('#mrdevStep2 .mrdev-toggle-link');
    const infoBox1Title = document.querySelector('#mrdevInfoBox p');
    const infoBox1Small = document.querySelector('#mrdevInfoBox small');
    const infoBox2Title = document.querySelector('#mrdevHelpBox p');
    const moreInfoLink1 = document.querySelector('#mrdevInfoBox .more-info-link a');
    const moreInfoLink2 = document.querySelector('#mrdevHelpBox .more-info-link a');
    const modalTitle = document.querySelector('#mrdevLoginModal .modal-header h3');
    
    if (step1Heading) step1Heading.textContent = t('mrdev_id');
    if (step1Subheading) step1Subheading.textContent = t('mrdev_id_desc');
    if (step2Heading) step2Heading.textContent = t('enter_code');
    if (step2Subheading) step2Subheading.textContent = t('code_sent');
    if (toggleLink1 && !toggleLink1.textContent.includes('▲')) toggleLink1.textContent = t('mrdev_what') + ' ▼';
    if (toggleLink2 && !toggleLink2.textContent.includes('▲')) toggleLink2.textContent = t('resend_code') + ' ▼';
    if (infoBox1Title) infoBox1Title.textContent = t('mrdev_what_desc');
    if (infoBox1Small) infoBox1Small.textContent = t('mrdev_what_desc_small');
    if (infoBox2Title) infoBox2Title.textContent = t('code_sent_desc');
    if (moreInfoLink1) moreInfoLink1.textContent = t('more_info') + ' →';
    if (moreInfoLink2) moreInfoLink2.textContent = t('more_info') + ' →';
    if (modalTitle) modalTitle.textContent = t('mrdev_login');
    
    const idInput = document.getElementById('mrdevIdInput');
    if (idInput) idInput.placeholder = t('mrdev_id_placeholder');
}

export function showMrdevLogin() {
    resetMrdevModal();
    updateMrdevModalTexts();
    closeModal('authModal');
    showModal('mrdevLoginModal');
    setTimeout(() => document.getElementById('mrdevIdInput')?.focus(), 400);
}

export function closeMrdevLoginModal() {
    clearInterval(mrdevLoginTimer);
    closeModal('mrdevLoginModal');
    currentStepData = null;
    isVerifying = false;
}

function resetMrdevModal() {
    const step1 = document.getElementById('mrdevStep1');
    const step2 = document.getElementById('mrdevStep2');
    if (step1) { step1.style.display = 'block'; step1.style.opacity = '1'; step1.style.transform = ''; }
    if (step2) step2.style.display = 'none';

    const idInput = document.getElementById('mrdevIdInput');
    if (idInput) { idInput.value = ''; idInput.classList.remove('error', 'success', 'loading'); }

    const errorEl = document.getElementById('mrdevError');
    if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('show'); }

    for (let i = 1; i <= 6; i++) {
        const box = document.getElementById(`otp${i}`);
        if (box) { box.value = ''; box.classList.remove('filled', 'box-error', 'box-success', 'loading-bar'); }
    }

    hideLoading();
    const successOverlay = document.getElementById('mrdevSuccessOverlay');
    if (successOverlay) { successOverlay.classList.remove('show', 'fade-out'); }
    const modal = document.getElementById('mrdevLoginModal');
    if (modal) modal.classList.remove('elastic-close');

    clearInterval(mrdevLoginTimer);
    currentStepData = null;
    isVerifying = false;
}

function setupIdInput() {
    const input = document.getElementById('mrdevIdInput');
    if (!input) return;

    input.addEventListener('input', function() {
        let val = this.value.replace(/[^0-9]/g, '');
        if (val.length > 6) val = val.slice(0, 6);
        this.value = val ? '#' + val : '';
        if (this.value.length === 7) setTimeout(() => submitMrdevId(), 300);
    });

    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); submitMrdevId(); }
    });
}

function setupOtpBoxes() {
    for (let i = 1; i <= 6; i++) {
        const box = document.getElementById(`otp${i}`);
        if (!box) continue;

        box.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 1);
            if (this.value) {
                this.classList.add('filled');
                if (i < 6) {
                    const next = document.getElementById(`otp${i + 1}`);
                    if (next) { next.focus(); next.select(); }
                }
                if (i === 6) setTimeout(() => autoVerify(), 200);
            } else {
                this.classList.remove('filled');
            }
        });

        box.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && !this.value && i > 1) {
                const prev = document.getElementById(`otp${i - 1}`);
                if (prev) { prev.focus(); prev.select(); }
            }
            if (e.key === 'Enter') autoVerify();
        });

        box.addEventListener('paste', function(e) {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text');
            const digits = text.replace(/\D/g, '').slice(0, 6);
            digits.split('').forEach((d, j) => {
                const target = document.getElementById(`otp${i + j}`);
                if (target) { target.value = d; target.classList.add('filled'); }
            });
            const last = document.getElementById(`otp${Math.min(i + digits.length, 6)}`);
            if (last) last.focus();
            if (digits.length === 6) setTimeout(() => autoVerify(), 200);
        });
    }
}

function startTimer(sec) {
    clearInterval(mrdevLoginTimer);
    let remaining = sec;
    const el = document.getElementById('mrdevTimer');

    mrdevLoginTimer = setInterval(() => {
        remaining--;
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        if (el) {
            el.textContent = `${m}:${s.toString().padStart(2, '0')}`;
            if (remaining <= 30) el.style.color = 'var(--orange)';
            if (remaining <= 10) el.style.color = 'var(--red)';
        }

        if (remaining <= 0) {
            clearInterval(mrdevLoginTimer);
            if (el) { el.textContent = '00:00'; el.style.color = 'var(--red)'; }
            const errorEl = document.getElementById('mrdevError');
            if (errorEl) { errorEl.textContent = t('expired'); errorEl.classList.add('show'); }
            setTimeout(resetMrdevModal, 2500);
        }
    }, 1000);
}

export async function submitMrdevId() {
    const idInput = document.getElementById('mrdevIdInput');
    const errorEl = document.getElementById('mrdevError');
    const id = idInput?.value.trim() || '';
    const cleanId = id.replace(/^#/, '');
    const lang = getCurrentLang();

    let idLengthError = '';
    if (lang === 'uz') idLengthError = '6 xonali raqam kiriting';
    else if (lang === 'ru') idLengthError = 'Введите 6-значный номер';
    else idLengthError = 'Enter 6-digit number';

    if (cleanId.length < 6) {
        if (errorEl) { errorEl.textContent = idLengthError; errorEl.classList.add('show'); }
        idInput?.classList.add('error');
        setTimeout(() => idInput?.classList.remove('error'), 2000);
        return;
    }

    const fullId = '#' + cleanId;
    idInput.value = fullId;
    idInput.classList.add('loading');
    showLoading();
    if (errorEl) errorEl.classList.remove('show');

    try {
        const userData = await loginWithMrdevId(fullId);

        currentStepData = {
            firestoreUid: userData.firestoreUid || userData.uid,
            uid: userData.uid,
            email: userData.email,
            mrdevId: fullId,
            displayName: userData.displayName,
            photoURL: userData.photoURL,
            mrdevPassword: userData.mrdevPassword,
            linkedTo: userData.linkedTo || null
        };

        const otp = generateSecureOTP();
        const newRef = push(ref(rtdb, 'pass_notifications'));
        await set(newRef, {
            passCode: otp, mrdevId: fullId,
            uid: userData.uid, firestoreUid: userData.firestoreUid || userData.uid,
            email: userData.email, expiresAt: Date.now() + 120000,
            used: false, createdAt: Date.now()
        });

        hideLoading();
        idInput.classList.remove('loading');
        idInput.classList.add('success');

        logger.mrdev.otpSentDev(otp);

        const step1 = document.getElementById('mrdevStep1');
        const step2 = document.getElementById('mrdevStep2');
        
        if (step1) { step1.style.opacity = '0'; step1.style.transform = 'translateX(-30px)'; step1.style.transition = 'all 0.3s ease'; }

        setTimeout(() => {
            if (step1) step1.style.display = 'none';
            if (step2) {
                step2.style.display = 'block';
                step2.style.opacity = '0';
                step2.style.transform = 'translateX(30px)';
                step2.style.transition = 'all 0.3s ease';
                requestAnimationFrame(() => { step2.style.opacity = '1'; step2.style.transform = 'translateX(0)'; });
                updateMrdevModalTexts();
            }
            startTimer(120);
            setupOtpBoxes();
            setTimeout(() => document.getElementById('otp1')?.focus(), 350);
        }, 300);

        showToast(t('code_sent'), 'success');
    } catch (e) {
        hideLoading();
        idInput.classList.remove('loading');
        idInput.classList.add('error');
        if (errorEl) { errorEl.textContent = e.message || t('error'); errorEl.classList.add('show'); }
        setTimeout(() => idInput.classList.remove('error', 'success'), 2000);
    }
}

async function autoVerify() {
    if (isVerifying) return;
    isVerifying = true;

    const errorEl = document.getElementById('mrdevError');
    let pass = '';
    for (let i = 1; i <= 6; i++) pass += document.getElementById(`otp${i}`)?.value || '';

    if (pass.length !== 6) { isVerifying = false; return; }
    if (!currentStepData) {
        if (errorEl) { errorEl.textContent = t('expired'); errorEl.classList.add('show'); }
        isVerifying = false; return;
    }

    showLoading();
    for (let i = 1; i <= 6; i++) document.getElementById(`otp${i}`)?.classList.add('loading-bar');
    if (errorEl) errorEl.classList.remove('show');

    try {
        const snapshot = await get(ref(rtdb, 'pass_notifications'));
        const data = snapshot.val();
        if (!data) throw new Error(t('error'));

        let foundKey = null, foundData = null;
        for (const [key, val] of Object.entries(data)) {
            if (val.passCode === pass && val.mrdevId === currentStepData.mrdevId && !val.used && val.expiresAt > Date.now()) {
                foundKey = key; foundData = val; break;
            }
        }

        if (!foundData) throw new Error(t('error'));

        await update(ref(rtdb, `pass_notifications/${foundKey}`), { used: true, verifiedAt: Date.now() });
        clearInterval(mrdevLoginTimer);

        hideLoading();
        for (let i = 1; i <= 6; i++) document.getElementById(`otp${i}`)?.classList.remove('loading-bar');

        showSuccessAnimation();

        let targetUid = currentStepData.firestoreUid || currentStepData.uid;
        let targetEmail = currentStepData.email;
        let targetDisplayName = currentStepData.displayName;

        if (currentStepData.linkedTo) {
            const linkedAccount = await getLinkedAccount(currentStepData.linkedTo);
            if (linkedAccount) {
                targetUid = linkedAccount.uid;
                targetEmail = linkedAccount.email;
                targetDisplayName = linkedAccount.displayName;
            }
        }

        if (currentStepData.email && currentStepData.mrdevPassword) {
            try { await signInWithEmailAndPassword(auth, currentStepData.email, currentStepData.mrdevPassword); }
            catch (e) { console.warn(e); }
        }

        saveLocalAuth({
            uid: targetUid, email: targetEmail, displayName: targetDisplayName,
            photoURL: currentStepData.photoURL, mrdevId: currentStepData.mrdevId, linkedTo: currentStepData.linkedTo
        });

        setTimeout(() => window.location.reload(), 3200);

    } catch (e) {
        hideLoading();
        for (let i = 1; i <= 6; i++) document.getElementById(`otp${i}`)?.classList.remove('loading-bar');
        if (errorEl) { errorEl.textContent = e.message || t('error'); errorEl.classList.add('show'); }
        showErrorAnimation();
        isVerifying = false;
    }
}

function showSuccessAnimation() {
    for (let i = 1; i <= 6; i++) {
        setTimeout(() => document.getElementById(`otp${i}`)?.classList.add('box-success'), i * 50);
    }
    setTimeout(() => document.getElementById('mrdevSuccessOverlay')?.classList.add('show'), 350);
    setTimeout(() => document.getElementById('mrdevSuccessOverlay')?.classList.add('fade-out'), 1800);
    setTimeout(() => document.getElementById('mrdevLoginModal')?.classList.add('elastic-close'), 2400);
    setTimeout(() => {
        closeMrdevLoginModal();
        document.getElementById('mrdevLoginModal')?.classList.remove('elastic-close');
        document.getElementById('mrdevSuccessOverlay')?.classList.remove('show', 'fade-out');
    }, 3200);
    if (typeof confetti === 'function') {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6, x: 0.5 }, colors: ['#2a7de1', '#5c9eff', '#ffffff', '#4dcd5e'] });
    }
}

function showErrorAnimation() {
    const wrap = document.getElementById('mrdevOtpWrap');
    for (let i = 1; i <= 6; i++) {
        const box = document.getElementById(`otp${i}`);
        if (box) { box.classList.remove('loading-bar'); box.classList.add('box-error'); }
    }
    if (wrap) { wrap.classList.add('shake'); setTimeout(() => wrap.classList.remove('shake'), 500); }
    setTimeout(() => {
        for (let i = 1; i <= 6; i++) {
            const box = document.getElementById(`otp${i}`);
            if (box) { box.value = ''; box.classList.remove('filled', 'box-error', 'box-success'); }
        }
        document.getElementById('otp1')?.focus();
    }, 1500);
}

window.toggleMrdevInfoBox = function() {
    const box = document.getElementById('mrdevInfoBox');
    const link = document.querySelector('#mrdevStep1 .mrdev-toggle-link');
    if (box) {
        const isOpen = box.classList.toggle('show');
        if (link) link.textContent = isOpen ? '▲ ' + t('close') : t('mrdev_what') + ' ▼';
        if (isOpen) updateMrdevModalTexts();
    }
};

window.toggleMrdevHelpBox = function() {
    const box = document.getElementById('mrdevHelpBox');
    const link = document.querySelector('#mrdevStep2 .mrdev-toggle-link');
    if (box) {
        const isOpen = box.classList.toggle('show');
        if (link) link.textContent = isOpen ? '▲ ' + t('close') : t('resend_code') + ' ▼';
        if (isOpen) updateMrdevModalTexts();
    }
};

window.moreInfo = function() {
    closeMrdevLoginModal();
    window.location.href = './about/';
};

document.addEventListener('DOMContentLoaded', () => {
    setupIdInput();
    updateMrdevModalTexts();
});

document.addEventListener('languageChanged', () => {
    updateMrdevModalTexts();
    const step2 = document.getElementById('mrdevStep2');
    if (step2 && step2.style.display !== 'none') {
        const timerEl = document.getElementById('mrdevTimer');
        if (timerEl && timerEl.textContent !== '00:00') {
            const errorEl = document.getElementById('mrdevError');
            if (errorEl) errorEl.textContent = '';
        }
    }
});

window.showMrdevLogin = showMrdevLogin;
window.closeMrdevLoginModal = closeMrdevLoginModal;
window.submitMrdevId = submitMrdevId;
window.verifyMrdevPass = autoVerify;
window.autoVerify = autoVerify;
window.moreInfo = moreInfo;

logger.mrdevLoginLoaded();