import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, setPersistence, browserLocalPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import config from "../config.js";

const appName = "mrdev_main";
let app = getApps().find(a => a.name === appName);
if (!app) app = initializeApp(config.main, appName);
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app);
setPersistence(auth, browserLocalPersistence);
export { app, auth, db, rtdb };