// ==================== CONFIG — GroupBoard ====================
// Kalitlar /api/config dan asinxron yuklanadi

// ==================== AUTH EXPIRY ====================
// Foydalanuvchi sessiyasining amal qilish muddati (soatlarda).
// auth.js, auth-helper.js va firebase-helper.js shu konstantadan foydalanadi.
// Tavsiya: 72 soat (3 kun) — xavfsizlik va UX muvozanati.
export const AUTH_EXPIRY_HOURS = 72;

async function loadConfig() {
    const res = await fetch("/api/config");
    if (!res.ok) throw new Error("Config yuklanmadi");
    return await res.json();
}

const cfg = await loadConfig();

if (!cfg.groupboard?.apiKey) {
    console.error("❌ groupboard/config: config topilmadi!");
}

export const firebaseConfig = cfg.groupboard;

export function getConfig() { return cfg; }  // ← faqat shu qator yangi

export const appConfig = {
    maxFileSize:      5 * 1024 * 1024,
    maxMessageLength: 250,
    defaultZoom:      1,
    minZoom:          0.2,
    maxZoom:          5
};

export default firebaseConfig;