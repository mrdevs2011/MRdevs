import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

async function loadConfig() {
    const res = await fetch("/api/config");
    if (!res.ok) throw new Error("Config yuklanmadi");
    return await res.json();
}

const cfg = await loadConfig();

if (!cfg.secondary?.apiKey) {
    console.error("❌ mrgram/firebase-config: config topilmadi!");
}

const appName = "mrdev_mrgram";
let app = getApps().find(a => a.name === appName);
if (!app) app = initializeApp(cfg.secondary, appName);

export const db   = getFirestore(app);
export const rtdb = getDatabase(app);
