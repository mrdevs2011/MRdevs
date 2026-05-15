// ==================== FIREBASE CONFIG — Learncode ====================
// Kalitlar {} dan o'qiladi — to'g'ridan-to'g'ri yozilmaydi.

import { initializeApp } from 'firebase/app';
import { getFirestore }  from 'firebase/firestore';
import { getDatabase }   from 'firebase/database';

const ENV = {}; // {} shimmed for browser

const firebaseConfig = {
    apiKey:            ENV.VITE_SECONDARY_API_KEY             || '',
    authDomain:        ENV.VITE_SECONDARY_AUTH_DOMAIN         || '',
    projectId:         ENV.VITE_SECONDARY_PROJECT_ID          || '',
    storageBucket:     ENV.VITE_SECONDARY_STORAGE_BUCKET      || '',
    messagingSenderId: ENV.VITE_SECONDARY_MESSAGING_SENDER_ID || '',
    appId:             ENV.VITE_SECONDARY_APP_ID              || '',
    measurementId:     ENV.VITE_SECONDARY_MEASUREMENT_ID      || '',
    databaseURL:       ENV.VITE_SECONDARY_DATABASE_URL        || ''
};

if (!firebaseConfig.apiKey) {
    console.error('❌ learncode/firebase-config: ENV kalitlar topilmadi!');
}

const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const rtdb = getDatabase(app);

console.log('✅ Firebase ulandi - Learncode.uz');
