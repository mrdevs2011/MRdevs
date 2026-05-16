// ==================== MRDEV MULTI-ACCOUNT MANAGER v2.0 ====================

import logger from './logger.js';

const STORAGE_KEY  = 'mrdev_accounts';
const ACTIVE_KEY   = 'mrdev_active_account';
const MAX_ACCOUNTS = 3;

// ==================== O'QISH ====================

export function getAllAccounts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

export function getActiveAccount() {
    try {
        return JSON.parse(localStorage.getItem(ACTIVE_KEY) || 'null');
    } catch (e) {
        return null;
    }
}

// ==================== YOZISH ====================

function saveAccounts(accounts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
}

function saveActiveAccount(account) {
    if (account) {
        localStorage.setItem(ACTIVE_KEY, JSON.stringify({
            uid:         account.uid,
            email:       account.email       || '',
            displayName: account.displayName || 'User',
            photoURL:    account.photoURL    || null,
            provider:    account.provider    || 'mrdev',
            mrdevId:     account.mrdevId     || '',
            lastActive:  Date.now()
        }));
    } else {
        localStorage.removeItem(ACTIVE_KEY);
    }
}

// ==================== ASOSIY OPERATSIYALAR ====================

export function addOrUpdateAccount(user, extra = {}) {
    if (!user || !user.uid) {
        logger.error.auth('addOrUpdateAccount: user.uid yo\'q');
        return null;
    }

    const accounts      = getAllAccounts();
    const existingIndex = accounts.findIndex(a => a.uid === user.uid);

    const existingMrdevId = existingIndex >= 0 ? accounts[existingIndex].mrdevId : '';
    const mrdevId = (
        user.mrdevId                          ||
        extra.mrdevId                         ||
        existingMrdevId                       ||
        localStorage.getItem('mrdev_user_id') ||
        ''
    );

    const accountData = {
        uid:         user.uid,
        email:       user.email       || extra.email       || '',
        displayName: user.displayName || extra.displayName || 'User',
        photoURL:    user.photoURL    || extra.photoURL    || null,
        provider:    extra.provider   || user.providerData?.[0]?.providerId || 'mrdev',
        mrdevId:     mrdevId,
        addedAt:     existingIndex >= 0 ? (accounts[existingIndex].addedAt || Date.now()) : Date.now(),
        lastActive:  Date.now()
    };

    if (existingIndex >= 0) {
        accounts[existingIndex] = accountData;
    } else {
        if (accounts.length >= MAX_ACCOUNTS) {
            accounts.sort((a, b) => (a.lastActive || 0) - (b.lastActive || 0));
            accounts.shift();
        }
        accounts.push(accountData);
    }

    saveAccounts(accounts);
    setActiveAccount(user.uid);

    logger.localAuth.saved(accountData.uid);
    return accountData;
}

export function setActiveAccount(uid) {
    const accounts = getAllAccounts();
    const account  = accounts.find(a => a.uid === uid);
    if (account) {
        account.lastActive = Date.now();
        saveAccounts(accounts);
        saveActiveAccount(account);
        return account;
    }
    return null;
}

export function removeAccount(uid) {
    const accounts = getAllAccounts();
    const filtered = accounts.filter(a => a.uid !== uid);

    if (filtered.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(ACTIVE_KEY);
        return null;
    }

    saveAccounts(filtered);

    const activeAccount = getActiveAccount();
    if (activeAccount && activeAccount.uid === uid) {
        const newActive = filtered[0];
        setActiveAccount(newActive.uid);
        return newActive;
    }
    return activeAccount;
}

export function isAccountLimitReached() {
    return getAllAccounts().length >= MAX_ACCOUNTS;
}

export function getAccountCount() {
    return getAllAccounts().length;
}

export function getMaxAccounts() {
    return MAX_ACCOUNTS;
}

export function clearAllAccounts() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_KEY);
    logger.auth.logout();
}
