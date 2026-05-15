// ==================== CONFIG — GroupBoard ====================
// Kalitlar {} dan o'qiladi (Vite build vaqtida inline bo'ladi)

export const firebaseConfig = {
    apiKey:            '',
    authDomain:        '',
    databaseURL:       '',
    projectId:         '',
    storageBucket:     '',
    messagingSenderId: '',
    appId:             '',
    measurementId:     ''
};

if (!firebaseConfig.apiKey) {
    console.error('❌ groupboard/config: ENV kalitlar topilmadi!');
}

export const appConfig = {
    maxFileSize:       5 * 1024 * 1024,
    maxMessageLength:  250,
    defaultZoom:       1,
    minZoom:           0.2,
    maxZoom:           5
};

export default firebaseConfig;
