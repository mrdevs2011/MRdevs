// ==================== CONFIG — MRDEV ====================
// Kalitlar /api/config dan asinxron yuklanadi

// ── AUTH sozlamalari ──────────────────────────────────
// Sessiya muddati (soatda). Shu vaqtdan keyin qayta login talab qilinadi.
export const AUTH_EXPIRY_HOURS = 72;

// ── App sozlamalari ───────────────────────────────────
export const appConfig = {
    maxFileSize:      5 * 1024 * 1024,
    maxMessageLength: 250,
    defaultZoom:      1,
    minZoom:          0.2,
    maxZoom:          5
};

// ── Config yuklash ────────────────────────────────────
async function loadConfig() {
    try {
        const res = await fetch("/api/config");
        if (!res.ok) throw new Error("Config yuklanmadi: " + res.status);
        return await res.json();
    } catch (e) {
        console.warn("⚠️ /api/config topilmadi — Firebase sozlamalari bo'sh bo'lishi mumkin:", e.message);
        return {
            main:       {},
            secondary:  {},
            groupboard: {},
            supabase:   { url: "", key: "" },
            app:        { name: "MRDEV", version: "7.0", theme: "dark" }
        };
    }
}

const cfg = await loadConfig();

if (!cfg.groupboard?.apiKey) {
    console.warn("⚠️ groupboard/config: apiKey topilmadi — Firebase disabled mode.");
}

export const firebaseConfig = cfg.groupboard || {};

export function getConfig() { return cfg; }

export default firebaseConfig;
