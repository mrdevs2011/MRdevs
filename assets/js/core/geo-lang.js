// ==================== MRDEV GEO-LANG v1.0 ====================
// GPS joylashuvi orqali avtomatik til aniqlash.
// Foydalanuvchi qo'lda til tanlagan bo'lsa — ishlamaydi.

import { setLanguage } from './i18n.js';

// ─── Konstantalar ───────────────────────────────────────────
const MANUAL_KEY   = 'mrdev_lang_manual';   // Qo'lda tanlangan belgisi
const GEO_DONE_KEY = 'mrdev_geo_detected';  // Shu sessiyada bajarilganligi

// Mamlakat kodi → til
const COUNTRY_LANG_MAP = {
    // O'zbekcha
    UZ: 'uz',

    // Ruscha (MDH + Rossiya)
    RU: 'ru', BY: 'ru', KZ: 'ru', KG: 'ru',
    TJ: 'ru', TM: 'ru', AM: 'ru', AZ: 'ru',
    MD: 'ru', UA: 'ru', GE: 'ru',

    // Qolganlar → inglizcha (default)
};

// ─── Yordamchi funksiyalar ───────────────────────────────────

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

// ─── GPS orqali mamlakat olish ───────────────────────────────

/**
 * Brauzerning Geolocation API dan koordinatalar olish.
 * maximumAge=86400000 → 24 soat davomida brauzер keshdan qaytaradi
 * (har safar GPS so'ramaydi).
 */
function getGPSCoords() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('geolocation_not_supported'));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            pos  => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            err  => reject(err),
            { timeout: 8000, maximumAge: 86400000 }
        );
    });
}

/**
 * Nominatim (OpenStreetMap) orqali koordinatalardan
 * mamlakatning 2 harfli kodini olish.
 * Bepul, API kalit talab qilmaydi.
 */
async function coordsToCountry(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`;
    const res  = await fetch(url, {
        headers: { 'User-Agent': 'MRDEV-App/1.0' }
    });
    if (!res.ok) throw new Error('nominatim_failed');
    const data = await res.json();
    const code = data?.address?.country_code?.toUpperCase();
    return code || null;
}

/**
 * Brauzer tiliga qarab til aniqlash (GPS rad etilganda fallback).
 * navigator.language → "uz-UZ", "ru-RU", "en-US" kabi
 */
function detectFromBrowserLang() {
    const lang = (navigator.language || navigator.languages?.[0] || '').toLowerCase();
    if (lang.startsWith('uz')) return 'uz';
    if (lang.startsWith('ru')) return 'ru';
    return 'en';
}

// ─── Asosiy funksiya ─────────────────────────────────────────

/**
 * GPS asosida tilni avtomatik aniqlash va o'rnatish.
 *
 * Qoidalar:
 *  1. Foydalanuvchi qo'lda til tanlagan bo'lsa → ishlamaydi
 *  2. Shu sessiyada allaqachon bajarilgan bo'lsa → ishlamaydi
 *  3. GPS ruxsat berilsa → Nominatim → mamlakatdan til
 *  4. GPS rad etilsa → brauzer tili → til
 *
 * @returns {string|null} O'rnatilgan til kodi yoki null
 */
export async function autoDetectLanguage() {
    // 1. Foydalanuvchi qo'lda til tanlagan bo'lsa — tegma
    if (isLangManual()) return null;

    // 2. Bu seans ichida allaqachon GPS detection bajarilgan bo'lsa — qayta qilma
    if (sessionStorage.getItem(GEO_DONE_KEY)) return null;

    let detectedLang = null;

    try {
        // GPS koordinatalar olish
        const { lat, lon } = await getGPSCoords();

        // Nominatim orqali mamlakatni aniqlash
        const countryCode = await coordsToCountry(lat, lon);

        detectedLang = COUNTRY_LANG_MAP[countryCode] || 'en';

    } catch (_gpsErr) {
        // GPS rad etildi yoki xato → brauzer tiliga qarab
        detectedLang = detectFromBrowserLang();
    }

    if (detectedLang) {
        setLanguage(detectedLang);
        sessionStorage.setItem(GEO_DONE_KEY, '1');
    }

    return detectedLang;
}