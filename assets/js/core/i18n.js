// ==================== MRDEV I18N v5.0 ====================
// Tarjimalar endi alohida JSON fayllardan yuklanadi (assets/locales/)
// Avvalgi: 420 qator JS — Yangi: dinamik JSON import

const SUPPORTED_LANGS = ['uz', 'ru', 'en'];
const LANG_NAMES = { uz: "O'zbekcha", ru: "Русский", en: "English" };

// Cache: bir marta yuklangan tarjimalar xotirada saqlanadi
const cache = {};

let currentLang = localStorage.getItem('mrdev_lang') || 'uz';

// ==================== YUKLASH ====================
async function loadLocale(lang) {
    if (cache[lang]) return cache[lang];
    try {
        // Vite build paytida statik import sifatida bundlelanadi
        const modules = import.meta.glob('../../locales/*.json');
        const loader = modules[`../../locales/${lang}.json`];
        if (!loader) throw new Error(`missing ${lang}`);
        const data = await loader();
        cache[lang] = data.default || data;
        return cache[lang];
    } catch (e) {
        console.warn(`[i18n] "${lang}" fayli topilmadi, "uz" ga qaytildi`);
        if (lang !== 'uz') return loadLocale('uz');
        return {};
    }
}

// ==================== ASOSIY FUNKSIYALAR ====================

/**
 * Kalit bo'yicha tarjimani qaytaradi (sinxron, cache dan)
 * @param {string} key
 * @returns {string}
 */
export function t(key) {
    const dict = cache[currentLang] || cache['uz'] || {};
    return dict[key] ?? key;
}

/**
 * Tilni o'zgartirish (asinxron — JSON yuklab keyin DOM yangilanadi)
 * @param {string} lang
 */
export async function setLanguage(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return false;
    await loadLocale(lang);
    currentLang = lang;
    localStorage.setItem('mrdev_lang', lang);
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    return true;
}

export function getCurrentLang()      { return currentLang; }
export function getAvailableLangs()   { return [...SUPPORTED_LANGS]; }
export function getLangName(lang)     { return LANG_NAMES[lang] || lang; }

// ==================== DOM TARJIMASI ====================
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const text = t(key);
        if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
            el.placeholder = text;
        } else if (el.tagName === 'IMG') {
            el.alt = text;
        } else {
            el.textContent = text;
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (key) el.placeholder = t(key);
    });
}

/**
 * Sahifa yuklanganda chaqiriladi.
 * Joriy til JSON ni yuklaydi va DOM ni yangilaydi.
 */
export async function initI18n() {
    const saved = localStorage.getItem('mrdev_lang');
    if (saved && SUPPORTED_LANGS.includes(saved)) {
        currentLang = saved;
    }
    // Asosiy til va fallback (uz) ni parallel yuklash
    await Promise.all([
        loadLocale(currentLang),
        currentLang !== 'uz' ? loadLocale('uz') : Promise.resolve()
    ]);
    document.documentElement.lang = currentLang;
    applyTranslations();
}

// Til o'zgarganda DOM ni yangilaymiz
document.addEventListener('languageChanged', applyTranslations);

// Global kirish (module bo'lmagan sahifalar uchun)
window.mrdevI18n = { t, setLanguage, getCurrentLang, initI18n };
