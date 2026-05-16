// ==================== CONFIG — GroupBoard ====================
// Kalitlar /api/config dan asinxron yuklanadi

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

export const appConfig = {
    maxFileSize:      5 * 1024 * 1024,
    maxMessageLength: 250,
    defaultZoom:      1,
    minZoom:          0.2,
    maxZoom:          5
};

export default firebaseConfig;
