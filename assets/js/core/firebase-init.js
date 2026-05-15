// ==================== MRDEV FIREBASE INIT v2.0 ====================
// CDN emas, npm package ishlatiladi (tree-shaking + bundling uchun)
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import config from '../config.js';

const appName = 'mrdev_main';
let app = getApps().find(a => a.name === appName);
if (!app) app = initializeApp(config.main, appName);

const auth = getAuth(app);
const db   = getFirestore(app);
const rtdb = getDatabase(app);

setPersistence(auth, browserLocalPersistence);

export { app, auth, db, rtdb };
