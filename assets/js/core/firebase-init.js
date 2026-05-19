// ==================== MRDEV FIREBASE INIT v2.0 ====================
// BUG FIX: config bo'sh bo'lsa initializeApp xato otib modul zanjirini
// butunlay buzardi. Endi try-catch bilan xavfsiz ishga tushadi.

import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getConfig } from "../config.js";

let app  = null;
let auth = null;
let db   = null;
let rtdb = null;

try {
    const config = await getConfig();

    if (!config?.main?.apiKey) {
        console.warn("⚠️ Firebase config topilmadi (apiKey yo'q) — offline/mehmon rejimda ishlamoqda.");
    } else {
        const appName = "mrdev_main";
        app  = getApps().find(a => a.name === appName) || initializeApp(config.main, appName);
        auth = getAuth(app);
        db   = getFirestore(app);
        rtdb = getDatabase(app);

        // Persistence xatosi butun init ni to'xtatmasin
        setPersistence(auth, browserLocalPersistence).catch(e => {
            console.warn("⚠️ Firebase persistence xatosi:", e.message);
        });
    }
} catch (e) {
    console.warn("⚠️ Firebase init xatosi — offline rejimda ishlamoqda:", e.message);
    // app/auth/db/rtdb null qoladi — auth.js null tekshiradi
}

export { app, auth, db, rtdb };
