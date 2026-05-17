// ==================== MRDEV GEO-LANG v2.0 ====================
// Til aniqlash — faqat navigator.language orqali (GPS yo'q).
// GPS ruxsati foydalanuvchiga noqulay va til uchun keraksiz.

import { setLanguage } from './i18n.js';

// ─── Konstantalar ────────────────────────────────────────────
const MANUAL_KEY   = 'mrdev_lang_manual';   // Qo'lda tanlangan belgisi
const GEO_DONE_KEY = 'mrdev_geo_detected';  // Shu sessiyada bajarilganligi

// Brauzer tili prefiksi → til kodi
const LANG_PREFIX_MAP = {
    uz: 'uz',
    ru: 'ru', be: 'ru', kk: 'ru', ky: 'ru',
    tg: 'ru', tk: 'ru', hy: 'ru', az: 'ru',
    uk: 'ru', ka: 'ru',
};

// ─── Yordamchi funksiyalar ────────────────────────────────────

/** Foydalanuvchi qo'lda til tanlaganmi? */
export function isLangManual() {
    return localStorage.getItem(MANUAL_KEY) === '1';
}

/** Til qo'lda tanlangan deb belgilash (settings dan chaqiriladi) */
export function markLangAsManual() {
    localStorage.setItem(MANUAL_KEY, '1');
}

/** Qo'lda tanlangan belgisini o'chirish (reset) */
export function resetManualLang() {
    localStorage.removeItem(MANUAL_KEY);
    sessionStorage.removeItem(GEO_DONE_KEY);
}

// ─── Brauzer tilidan aniqlash ─────────────────────────────────

/**
 * navigator.language yoki navigator.languages dan til aniqlash.
 * Hech qanday permission so'ramaydi — darhol ishlaydi.
 */
function detectFromBrowserLang() {
    const langs = navigator.languages?.length
        ? [...navigator.languages]
        : [navigator.language || 'en'];

    for (const lang of langs) {
        const prefix = lang.toLowerCase().split('-')[0];
        if (LANG_PREFIX_MAP[prefix]) return LANG_PREFIX_MAP[prefix];
    }
    return 'en';
}

// ─── Asosiy funksiya ──────────────────────────────────────────

/**
 * Brauzer tili asosida tilni avtomatik aniqlash va o'rnatish.
 *
 * Qoidalar:
 *  1. Foydalanuvchi qo'lda til tanlagan bo'lsa → ishlamaydi
 *  2. Shu sessiyada allaqachon bajarilgan bo'lsa → ishlamaydi
 *  3. navigator.languages / navigator.language → til
 *
 * @returns {string|null} O'rnatilgan til kodi yoki null
 */
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
