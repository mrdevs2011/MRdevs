// ==================== MRDEV EMAIL AUTH v6.0 ====================
import logger from '../core/logger.js';
import { auth, db } from '../core/firebase-init.js';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import {
    doc, setDoc, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { showToast } from '../core/toast.js';
import { closeModal } from '../ui/modal.js';
import { saveUserMrdevId } from '../notif-pass.js';
import { t, getCurrentLang } from '../core/i18n.js';

const DOMAIN = '@mrdev.uz';
let _mode = 'login';

function $(id) { return document.getElementById(id); }

function setErr(msg) {
    const el = $('authError');
    if (!el) return;
    el.textContent = msg || '';
    el.style.display = msg ? 'block' : 'none';
}

function clearErr() { setErr(''); }

function setBtnLoading(on) {
    const btn = $('authSubmitBtn');
    if (!btn) return;
    btn.disabled = on;
    btn.textContent = on
        ? (_mode === 'register' ? t('register') + '...' : t('login') + '...')
        : (_mode === 'register' ? t('register') : t('login'));
}

function toEmail(raw) {
    const v = raw.trim().toLowerCase();
    return v.includes('@') ? v : v + DOMAIN;
}

function checkUsername(u) {
    const lang = getCurrentLang();
    if (!u || u.length < 3) {
        return lang === 'uz' ? "Username kamida 3 ta belgi" :
               lang === 'ru' ? "Имя пользователя минимум 3 символа" :
               "Username must be at least 3 characters";
    }
    if (u.length > 20) {
        return lang === 'uz' ? "Username 20 ta belgidan oshmasin" :
               lang === 'ru' ? "Имя пользователя не более 20 символов" :
               "Username must be at most 20 characters";
    }
    if (!/^[a-z0-9._]+$/.test(u)) {
        return lang === 'uz' ? "Faqat kichik harflar, raqamlar, nuqta yoki _" :
               lang === 'ru' ? "Только строчные буквы, цифры, точка или _" :
               "Only lowercase letters, numbers, dot or underscore";
    }
    if (/^[._]|[._]$/.test(u)) {
        return lang === 'uz' ? "Nuqta yoki _ bilan boshlanib/tugamasin" :
               lang === 'ru' ? "Не может начинаться или заканчиваться на . или _" :
               "Cannot start or end with . or _";
    }
    return null;
}

function firebaseErr(code) {
    const lang = getCurrentLang();
    const errors = {
        uz: {
            'auth/user-not-found': 'Foydalanuvchi topilmadi',
            'auth/wrong-password': 'Parol noto\'g\'ri',
            'auth/invalid-credential': 'Email yoki parol xato',
            'auth/email-already-in-use': 'Bu username band',
            'auth/weak-password': 'Parol juda oddiy',
            'auth/invalid-email': 'Email formati noto\'g\'ri',
            'auth/user-disabled': 'Hisob bloklangan',
            'auth/too-many-requests': 'Ko\'p urinish. Bir oz kutib qayta urinib ko\'ring',
            'auth/network-request-failed': 'Internet aloqasi yo\'q',
        },
        ru: {
            'auth/user-not-found': 'Пользователь не найден',
            'auth/wrong-password': 'Неверный пароль',
            'auth/invalid-credential': 'Неверный email или пароль',
            'auth/email-already-in-use': 'Это имя пользователя уже занято',
            'auth/weak-password': 'Слишком простой пароль',
            'auth/invalid-email': 'Неверный формат email',
            'auth/user-disabled': 'Аккаунт заблокирован',
            'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
            'auth/network-request-failed': 'Нет интернет соединения',
        },
        en: {
            'auth/user-not-found': 'User not found',
            'auth/wrong-password': 'Wrong password',
            'auth/invalid-credential': 'Invalid email or password',
            'auth/email-already-in-use': 'Username already taken',
            'auth/weak-password': 'Password is too weak',
            'auth/invalid-email': 'Invalid email format',
            'auth/user-disabled': 'Account disabled',
            'auth/too-many-requests': 'Too many attempts. Try again later',
            'auth/network-request-failed': 'No internet connection',
        }
    };
    return errors[lang]?.[code] || errors.uz[code] || t('error');
}

function updateModalTexts() {
    const isReg = _mode === 'register';
    
    const modalTitle = $('modalTitle');
    const authSubmitBtn = $('authSubmitBtn');
    const authToggleText = $('authToggleText');
    const authToggleLink = $('authToggleLink');
    const loginEmail = $('loginEmail');
    const loginPassword = $('loginPassword');
    
    if (modalTitle) modalTitle.textContent = isReg ? t('register') : t('login');
    if (authSubmitBtn) authSubmitBtn.textContent = isReg ? t('register') : t('login');
    if (authToggleText) authToggleText.textContent = isReg ? t('have_account') : t('no_account');
    if (authToggleLink) authToggleLink.textContent = isReg ? t('login') : t('register');
    
    if (loginEmail) {
        loginEmail.placeholder = isReg ? t('username_placeholder') : t('email_placeholder');
    }
    
    if (loginPassword) {
        loginPassword.placeholder = isReg ? t('password_placeholder_new') : t('password_placeholder');
        loginPassword.autocomplete = isReg ? 'new-password' : 'current-password';
    }
    
    const registerName = $('registerName');
    if (registerName && registerName.placeholder) {
        registerName.placeholder = t('name_placeholder');
    }
    
    const googleBtn = document.querySelector('.google-auth-btn span');
    if (googleBtn) googleBtn.textContent = t('google_login');
    
    const mrdevBtn = document.querySelector('.mrdev-auth-btn span');
    if (mrdevBtn) mrdevBtn.textContent = t('mrdev_login');
    
    const orSpan = document.querySelector('.auth-divider span');
    if (orSpan) orSpan.textContent = t('or');
}

export function setAuthMode(mode) {
    _mode = mode;
    clearErr();
    const isReg = mode === 'register';

    const regFields = $('registerFields');
    if (regFields) regFields.style.display = isReg ? 'block' : 'none';

    if ($('loginEmail')) {
        $('loginEmail').placeholder = isReg ? t('username_placeholder') : t('email_placeholder');
    }

    if ($('loginPassword')) {
        $('loginPassword').placeholder = isReg ? t('password_placeholder_new') : t('password_placeholder');
        $('loginPassword').autocomplete = isReg ? 'new-password' : 'current-password';
    }

    updateModalTexts();

    setTimeout(() => {
        (isReg ? $('registerName') : $('loginEmail'))?.focus();
    }, 120);
}

export function toggleAuthMode() {
    setAuthMode(_mode === 'login' ? 'register' : 'login');
}

export async function signInWithEmail() {
    logger.email.loginStart();
    clearErr();
    const raw = $('loginEmail')?.value.trim() || '';
    const pass = $('loginPassword')?.value || '';

    if (!raw) { setErr(t('email_required')); $('loginEmail')?.focus(); return; }
    if (!pass) { setErr(t('password_required')); $('loginPassword')?.focus(); return; }

    const email = toEmail(raw);
    const username = email.split('@')[0];
    const uErr = checkUsername(username);
    if (uErr) { setErr(uErr); return; }

    setBtnLoading(true);
    try {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const user = cred.user;

        logger.email.loginSuccess(user.uid);

        let mrdevId = '';
        try {
            mrdevId = await saveUserMrdevId(user) || '';
            if (mrdevId) localStorage.setItem('mrdev_user_id', mrdevId);
            logger.email.mrdevId(mrdevId);
        } catch (idErr) {
            logger.email.mrdevIdError(idErr.message);
        }

        localStorage.setItem('mrdev_local_auth', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || username,
            photoURL: user.photoURL || null,
            mrdevId: mrdevId,
            provider: 'mrdev_email',
            authType: 'email',
            isLoggedIn: true,
            loginTime: Date.now()
        }));

        showToast(t('welcome') + ' ✨', 'success');
        closeModal('authModal');
        _reset();
        setTimeout(() => window.location.reload(), 500);

    } catch (e) {
        logger.email.error(e.code, e.message);
        setErr(firebaseErr(e.code));
    } finally {
        setBtnLoading(false);
    }
}

export async function signUpWithEmail() {
    logger.email.registerStart();
    clearErr();
    const name = $('registerName')?.value.trim() || '';
    const raw = $('loginEmail')?.value.trim() || '';
    const pass = $('loginPassword')?.value || '';

    const username = raw.includes('@') ? raw.split('@')[0] : raw;
    const email = username + DOMAIN;

    if (!name || name.length < 2) {
        setErr(t('name_required'));
        $('registerName')?.focus();
        return;
    }
    const uErr = checkUsername(username);
    if (uErr) { setErr(uErr); $('loginEmail')?.focus(); return; }
    if (!pass || pass.length < 6) {
        setErr(t('password_length'));
        $('loginPassword')?.focus();
        return;
    }

    setBtnLoading(true);
    try {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const user = cred.user;
        logger.email.registerSuccess(user.uid);

        await updateProfile(user, { displayName: name });

        await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            email: email,
            username: username,
            displayName: name,
            photoURL: null,
            provider: 'mrdev_email',
            mrdevId: '',
            mrdevPassword: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
            isActive: true
        });
        logger.email.docCreated();

        let mrdevId = '';
        try {
            mrdevId = await saveUserMrdevId(user) || '';
            if (mrdevId) localStorage.setItem('mrdev_user_id', mrdevId);
            logger.email.newMrdevId(mrdevId);
        } catch (idErr) {
            logger.email.mrdevIdError(idErr.message);
        }

        localStorage.setItem('mrdev_local_auth', JSON.stringify({
            uid: user.uid,
            email: email,
            displayName: name,
            photoURL: null,
            mrdevId: mrdevId,
            provider: 'mrdev_email',
            authType: 'email',
            isLoggedIn: true,
            loginTime: Date.now()
        }));

        showToast(t('account_created') + '! ' + t('welcome') + ' 🎉', 'success');
        closeModal('authModal');
        _reset();
        logger.auth.loginOk();
        setTimeout(() => window.location.reload(), 500);

    } catch (e) {
        logger.email.error(e.code, e.message);
        setErr(firebaseErr(e.code));
    } finally {
        setBtnLoading(false);
    }
}

export function submitAuthForm() {
    if (_mode === 'register') {
        signUpWithEmail();
    } else {
        signInWithEmail();
    }
}

function _reset() {
    ['loginEmail', 'loginPassword', 'registerName'].forEach(id => {
        const el = $(id);
        if (el) el.value = '';
    });
    clearErr();
    _mode = 'login';
}

document.addEventListener('languageChanged', () => {
    if ($('authModal') && $('authModal').style.display !== 'none') {
        updateModalTexts();
    }
});