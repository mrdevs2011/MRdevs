// ==================== MRDEV GEO-LANG v2.0 ====================
// Til aniqlash — faqat navigator.language (GPS yo'q, permission yo'q).

import { setLanguage } from './i18n.js';

const MANUAL_KEY   = 'mrdev_lang_manual';
const GEO_DONE_KEY = 'mrdev_geo_detected';

const LANG_PREFIX_MAP = {
    uz: 'uz',
    ru: 'ru', be: 'ru', kk: 'ru', ky: 'ru',
    tg: 'ru', tk: 'ru', hy: 'ru', az: 'ru', uk: 'ru', ka: 'ru',
};

export function isLangManual() { return localStorage.getItem(MANUAL_KEY) === '1'; }
export function markLangAsManual() { localStorage.setItem(MANUAL_KEY, '1'); }
export function resetManualLang() {
    localStorage.removeItem(MANUAL_KEY);
    sessionStorage.removeItem(GEO_DONE_KEY);
}

function detectFromBrowserLang() {
    const langs = navigator.languages?.length ? [...navigator.languages] : [navigator.language || 'en'];
    for (const lang of langs) {
        const prefix = lang.toLowerCase().split('-')[0];
        if (LANG_PREFIX_MAP[prefix]) return LANG_PREFIX_MAP[prefix];
    }
    return 'en';
}

export function autoDetectLanguage() {
    if (isLangManual()) return null;
    if (sessionStorage.getItem(GEO_DONE_KEY)) return null;
    const detectedLang = detectFromBrowserLang();
    if (detectedLang) {
        setLanguage(detectedLang);
        sessionStorage.setItem(GEO_DONE_KEY, '1');
    }
    return detectedLang;
}
