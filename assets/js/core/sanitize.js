// ==================== MRDEV XSS SANITIZER v1.0 ====================
// Foydalanuvchi ma'lumotlarini (photoURL, displayName) innerHTML ga
// kiritishdan oldin tozalash uchun yagona modul.
//
// Ishlatish:
//   import { sanitizeURL, sanitizeText, setAvatarSafe } from './sanitize.js';

// ==================== RUXSAT ETILGAN DOMENLAR ====================
// photoURL faqat shu domenlardan bo'lishi mumkin.
const ALLOWED_PHOTO_DOMAINS = [
    'lh3.googleusercontent.com',   // Google profil rasmlari
    'googleusercontent.com',        // Google (umumiy)
    's.gravatar.com',               // Gravatar
    'gravatar.com',                 // Gravatar (www)
    'firebasestorage.googleapis.com', // Firebase Storage
    'storage.googleapis.com'        // Google Cloud Storage
];

// ==================== sanitizeURL ====================
/**
 * photoURL ni tekshiradi.
 * - faqat https:// protokoli
 * - faqat ALLOWED_PHOTO_DOMAINS ro'yxatidagi domenlar
 * - noto'g'ri URL → null (caller placeholder ko'rsatadi)
 *
 * @param {string|null|undefined} url
 * @returns {string|null}
 */
export function sanitizeURL(url) {
    if (!url || typeof url !== 'string') return null;
    try {
        const parsed   = new URL(url);
        if (parsed.protocol !== 'https:') return null;
        const hostname = parsed.hostname.toLowerCase();
        const allowed  = ALLOWED_PHOTO_DOMAINS.some(
            d => hostname === d || hostname.endsWith('.' + d)
        );
        return allowed ? url : null;
    } catch (e) {
        return null;
    }
}

// ==================== sanitizeText ====================
/**
 * Matnni HTML entities ga o'tkazadi (XSS uchun).
 * innerHTML ga interpolatsiya qilingan barcha matnlar shu funksiyadan o'tishi shart.
 *
 * @param {string|null|undefined} text
 * @returns {string}
 */
export function sanitizeText(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g,  '&amp;')
        .replace(/</g,  '&lt;')
        .replace(/>/g,  '&gt;')
        .replace(/"/g,  '&quot;')
        .replace(/'/g,  '&#x27;');
}

// ==================== setAvatarSafe ====================
/**
 * Avatar element ni xavfsiz tarzda to'ldiradi.
 * innerHTML o'rniga document.createElement('img') ishlatadi.
 *
 * @param {HTMLElement} el       - avatar container elementi
 * @param {string|null} photoURL - foydalanuvchi rasm URL si
 * @param {string}      fallback - placeholder (odatda bosh harf yoki '?')
 * @param {string}      [style]  - img uchun qo'shimcha style (ixtiyoriy)
 */
export function setAvatarSafe(el, photoURL, fallback, style = '') {
    if (!el) return;

    // Eski kontentni tozala
    el.textContent = '';

    const safeSrc = sanitizeURL(photoURL);
    if (safeSrc) {
        const img         = document.createElement('img');
        img.src           = safeSrc;
        img.alt           = typeof fallback === 'string' ? fallback : '';
        img.style.cssText = style || 'width:100%;height:100%;object-fit:cover;border-radius:50%;';
        img.loading       = 'lazy';
        el.appendChild(img);
    } else {
        el.textContent = fallback || '?';
    }
}

// ==================== avatarHTMLSafe ====================
/**
 * Avatar uchun xavfsiz HTML string qaytaradi.
 * Faqat katta template literallari ichida (insertAdjacentHTML / innerHTML = ...) ishlatish uchun.
 * Agar iloji bo'lsa setAvatarSafe() ni afzal ko'ring.
 *
 * @param {object|null} user
 * @param {number}      [size=44]
 * @returns {string}
 */
export function avatarHTMLSafe(user, size = 44) {
    if (!user) {
        return `<span style="font-size:${Math.round(size * 0.45)}px;">?</span>`;
    }
    const dn      = user.displayName || user.email?.split('@')[0] || 'U';
    const safeSrc = sanitizeURL(user.photoURL);
    const safeAlt = sanitizeText(dn);
    const initial = sanitizeText(dn.charAt(0).toUpperCase());

    if (safeSrc) {
        return `<img src="${safeSrc}" alt="${safeAlt}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" loading="lazy">`;
    }
    return `<span style="font-size:${Math.round(size * 0.42)}px;font-weight:700;">${initial}</span>`;
}