// ==================== MRDEV LOGGER v3.0 ====================
// BARCHA CONSOLE.LOG'LAR SHU YERDA!
// Boshqa fayllarda faqat: import logger from './logger.js'

const isLocal = (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname === '0.0.0.0' ||
    window.location.hostname.startsWith('192.168.') ||
    window.location.hostname.startsWith('10.0.') ||
    window.location.hostname.startsWith('172.') ||
    window.location.hostname.endsWith('.local') ||
    window.location.hostname.includes('live-server') ||
    window.location.hostname.includes('liveserver') ||
    window.location.hostname.includes('vite') ||
    window.location.hostname.includes('webpack') ||
    window.location.protocol === 'file:'
);

// DEFAULT: FALSE - hech qanday log chiqmaydi!
let enabled = false;

try {
    const stored = localStorage.getItem('mrdev_debug');
    if (stored === 'true') enabled = true;
    else if (stored === 'false') enabled = false;
    // isLocal bo'lsa ham FALSE qilib qo'ydik - log chiqmasligi uchun
    // else if (isLocal) enabled = true;  // BU QATOR O'CHIRILDI!
} catch(e) {
    enabled = false;
}

function log(level, ...args) {
    if (!enabled) return;
    switch(level) {
        case 'error': console.error(...args); break;
        case 'warn': console.warn(...args); break;
        default: console.log(...args);
    }
}

const logger = {
    
    // ==================== BOSHQARISH ====================
    on() {
        enabled = true;
        localStorage.setItem('mrdev_debug', 'true');
        console.log('🟢 MRDEV Logger: ON');
    },
    off() {
        enabled = false;
        localStorage.setItem('mrdev_debug', 'false');
    },
    status() { return enabled; },
    toggle() {
        enabled ? this.off() : this.on();
        return enabled;
    },
    
    // ==================== CONFIG ====================
    config: {
        loaded(projectId, hasEnv) {
            log('log', '✅ Config loaded');
            log('log', '🔥 MAIN Project:', projectId);
            log('log', '📦 window.__ENV__ exists:', hasEnv);
        },
        error(msg) {
            log('error', '❌ Config error:', msg);
        },
        firebaseReady(projectId) {
            log('log', '🔥 Firebase Config:', projectId);
        }
    },
    
    // ==================== FIREBASE INIT ====================
    firebase: {
        start() { log('log', '🚀 MRDEV Firebase Init v4.0'); },
        info(hostname, protocol, isLocalhost, isVercel, isDev, projectId, hasApiKey) {
            log('log', '📍 Hostname:', hostname);
            log('log', '🔒 Protocol:', protocol);
            log('log', '🏠 Localhost:', isLocalhost);
            log('log', '📦 Vercel:', isVercel);
            log('log', '🔥 Project ID:', projectId);
            log('log', '🔑 API Key:', hasApiKey ? '✓ Mavjud' : '✗ Topilmadi');
        },
        newApp(name) { log('log', '🆕 Yangi Firebase app yaratildi:', name); },
        ready(auth, firestore, rtdb) {
            log('log', '✅ Firebase servislari tayyor:');
            log('log', '   - Auth:', auth ? '✓' : '✗');
            log('log', '   - Firestore:', firestore ? '✓' : '✗');
            log('log', '   - Realtime DB:', rtdb ? '✓' : '✗');
        },
        done() {
            log('log', '✅ MRDEV Firebase Init v4.0 tayyor');
            log('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        },
        persistence(type) { log('log', '🔒 Persistence:', type); }
    },
    
    // ==================== AUTH ====================
    auth: {
        init() { log('log', '🚀 [Auth] initAuth v6.0 boshlandi'); },
        start(version) { log('log', '🚀 [Auth] initAuth', version, 'boshlandi'); },
        firebaseUser(email, uid) { log('log', '🔥 [Auth] Firebase user:', email, '| uid:', uid); },
        mrdevId(id) { log('log', '✅ [Auth] MRDEV ID:', id); },
        mrdevIdNull() { log('warn', '⚠️ [Auth] MRDEV ID null qaytdi!'); },
        mrdevIdError(msg) { log('error', '❌ [Auth] saveUserMrdevId xatolik:', msg); },
        currentUser(name, mrdevId) { log('log', '👤 [Auth] currentUser:', name, '| MRDEV ID:', mrdevId); },
        google(email) { log('log', '✅ Firebase Auth:', email); },
        mrdev(email) { log('log', '📦 Lokal auth:', email); },
        none() { log('log', '❌ Hech qanday auth yo\'q'); },
        saved(email) { log('log', '📦 Saqlangan akkaunt:', email); },
        changed(email) { log('log', '🔄 Auth o\'zgardi:', email || 'no user'); },
        centerLinked(id, email) { log('log', '✅ ' + id + ' -> ' + email + ' markaziga qo\'shildi'); },
        firebaseLogin(email) { log('log', '✅ Firebase Auth:', email); },
        loginOk() { log('log', '✅ MRDEV Login muvaffaqiyatli'); },
        logout() { log('log', '👋 Auth logout'); }
    },
    
    // ==================== MRDEV LOGIN ====================
    mrdev: {
        searching(id) { log('log', '🔍 MRDEV ID qidirilmoqda:', id); },
        found(email) { log('log', '✅ Foydalanuvchi topildi:', email); },
        otpSent(key) { log('log', '📤 RTDB ga yuborildi:', key); },
        otpSentDev(code) { if (isLocal) log('log', '🔑 DEV Parol:', code); },
        notify(id) { log('log', '📧 Parol xabarnomasi yuborildi:', id); },
        verifying(id) { log('log', '🔐 Parol tekshirilmoqda:', id); },
        success() { log('log', '✅ Parol to\'g\'ri!'); },
        wrong() { log('log', '❌ Noto\'g\'ri parol yoki muddati tugagan'); },
        loginOk() { log('log', '✅ MRDEV Login muvaffaqiyatli!'); },
        loaded() { log('log', '✅ MRDEV ID Login yuklandi'); }
    },
    
    // ==================== GOOGLE AUTH ====================
    google: {
        start() { log('log', '🔑 [GoogleAuth] Google login...'); },
        success(uid, email) { log('log', '🔑 [GoogleAuth] Google login OK:', uid, email); },
        newUser() { log('log', '📄 [GoogleAuth] Yangi Firestore doc yaratildi'); },
        existingUser() { log('log', '📄 [GoogleAuth] Mavjud Firestore doc yangilandi'); },
        mrdevId(id) { log('log', '🆔 [GoogleAuth] MRDEV ID:', id); },
        mrdevIdError(msg) { log('warn', '[GoogleAuth] MRDEV ID xatolik:', msg); },
        localSaved(mrdevId) { log('log', '✅ [GoogleAuth] mrdev_local_auth saqlandi, mrdevId:', mrdevId); },
        error(code, msg) { log('error', '[GoogleAuth] signInWithGoogle xatolik:', code, msg); }
    },
    
    // ==================== EMAIL AUTH ====================
    email: {
        loginStart() { log('log', '📧 [EmailAuth] Email login...'); },
        loginSuccess(uid) { log('log', '✅ [EmailAuth] Firebase login OK:', uid); },
        mrdevId(id) { log('log', '🆔 [EmailAuth] MRDEV ID:', id); },
        mrdevIdError(msg) { log('warn', '[EmailAuth] MRDEV ID xatosi:', msg); },
        registerStart() { log('log', '📝 [EmailAuth] Email register...'); },
        registerSuccess(uid) { log('log', '✅ [EmailAuth] Firebase register OK:', uid); },
        docCreated() { log('log', '📄 [EmailAuth] Firestore doc yaratildi'); },
        newMrdevId(id) { log('log', '🆔 [EmailAuth] Yangi MRDEV ID:', id); },
        error(code, msg) { log('error', '[EmailAuth] xatolik:', code, msg); }
    },
    
    // ==================== NOTIFICATIONS ====================
    notif: {
        firebaseUser(uid) { log('log', '🔥 [PassNotif] Firebase Auth user:', uid); },
        localUser(uid) { log('log', '📦 [PassNotif] Local auth user:', uid); },
        searching(uid, email) { log('log', '🔍 [PassNotif] Xabarlar qidirilmoqda... uid:', uid, 'email:', email); },
        found(count) { log('log', '📋 [PassNotif]', count, 'ta xabar topildi'); },
        error(msg) { log('error', '❌ [PassNotif] Load xatolik:', msg); }
    },
    
    // ==================== MRDEV CORE ====================
    core: {
        saveStart(uid, email, linkedTo) { log('log', '🔍 [MRDev] saveUserMrdevId:', { uid, email, linkedTo }); },
        existing(id) { log('log', '✅ [MRDev] Mavjud MRDEV ID:', id); },
        updateError(msg) { log('warn', '[MRDev] updateDoc xatolik:', msg); },
        newUpdate(id) { log('log', '🆕 [MRDev] Yangi MRDEV ID (update):', id); },
        newCreate(id) { log('log', '🆕 [MRDev] Yangi MRDEV ID (create):', id); },
        error(msg) { log('error', '❌ [MRDev] saveUserMrdevId xatolik:', msg); },
        loginStart(id) { log('log', '🔍 [MRDev] loginWithMrdevId:', id); },
        loginFound(email, linkedTo) { log('log', '✅ [MRDev] Foydalanuvchi topildi:', email, '| linkedTo:', linkedTo || 'yo\'q'); },
        loginError(msg) { log('error', '❌ [MRDev] loginWithMrdevId xatolik:', msg); },
        linkStart(id) { log('log', '🔗 [MRDev] getLinkedAccount:', id); },
        linkAccount(uid, target) { log('log', '🔗 [MRDev] linkAccount:', uid, '→', target); },
        linkSuccess(uid, target) { log('log', '✅ [MRDev] Hisob ulandi:', uid, '→', target); },
        linkError(msg) { log('error', '❌ [MRDev] linkAccount xatolik:', msg); },
        unlink(uid) { log('log', '🔓 [MRDev] unlinkAccount:', uid); },
        unlinkSuccess() { log('log', '✅ [MRDev] Ulanish o\'chirildi'); },
        sendCode(id) { log('log', '📤 [MRDev] sendPassCode:', id); },
        sendCodeSuccess(email) { log('log', '✅ [MRDev] Pass code yuborildi'); },
        sendCodeError(msg) { log('error', '❌ [MRDev] sendPassCode xatolik:', msg); },
        verifyCode(id) { log('log', '🔐 [MRDev] verifyPassCode:', id); },
        verifySuccess() { log('log', '✅ [MRDev] Pass code tasdiqlandi'); },
        verifyError(msg) { log('error', '❌ [MRDev] verifyPassCode xatolik:', msg); }
    },
    
    // ==================== BOARD ====================
    board: {
        init() { log('log', '🎨 MRDEV Board ishga tushmoqda...'); },
        ready(uid) { log('log', '✅ Board tayyor! UID:', uid); },
        save(uid) { log('log', '💾 Saqlash UID:', uid); },
        load(uid) { log('log', '☁️ Yuklash UID:', uid); },
        ui(name) { log('log', '👤 UI yangilandi:', name); },
        guest() { log('log', '👤 Mehmon'); },
        cloudSaveError(e) { log('error', 'Cloud save error:', e); },
        cloudLoadError(e) { log('error', 'Cloud load error:', e); },
        dropdownError(e) { log('warn', 'Dropdown init failed:', e); }
    },
    
    // ==================== LOCAL AUTH ====================
    localAuth: {
        check(found) { log('log', '🔍 Local auth:', found ? 'topildi' : 'yo\'q'); },
        found(email) { log('log', '✅ Local auth topildi:', email); },
        saved(uid) { log('log', '💾 Local auth saqlandi:', uid); }
    },
    
    // ==================== NOTIF-PASS ====================
    notifPass: {
        loaded() {
            log('log', '✅ MRDEV Notif-Pass yuklandi');
            log('log', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        },
        userSave(id) { log('log', '🔧 MRDEV ID saqlash:', id); },
        passwordUpdated() { log('log', '🔑 Yangi xavfsiz parol yaratildi'); },
        created(id) { log('log', '🆕 Yangi MRDEV ID:', id); }
    },
    
    // ==================== SIDEBAR & UI ====================
    ui: {
        sidebarInit() { log('log', '📱 Sidebar initializing...'); },
        userMenuInit() { log('log', '👤 User menu initializing...'); },
        dropdownInit(type) { log('log', '📋 Dropdown init:', type); },
        themeChanged(theme) { log('log', '🎨 Theme changed:', theme); },
        languageChanged(lang) { log('log', '🌐 Language changed:', lang); }
    },
    
    // ==================== SETTINGS ====================
    settings: {
        init() { log('log', '⚙️ Settings initializing...'); },
        cacheCleared(size) { log('log', '🗑️ Cache cleared:', size, 'items'); },
        themeSaved(theme) { log('log', '💾 Theme saved:', theme); },
        languageSaved(lang) { log('log', '💾 Language saved:', lang); },
        notificationsSaved(enabled) { log('log', '🔔 Notifications:', enabled ? 'ON' : 'OFF'); }
    },
    
    // ==================== XATOLIKLAR ====================
    error: {
        firebase(msg) { log('error', '❌ Firebase xatolik:', msg); },
        cloud(msg) { log('error', 'Cloud error:', msg); },
        dropdown(msg) { log('warn', 'Dropdown init failed:', msg); },
        verify(msg) { log('error', '❌ Verifikatsiya xatolik:', msg); },
        notif(msg) { log('error', '❌ Notif xatolik:', msg); },
        auth(msg) { log('warn', 'Auth xatolik:', msg); },
        config(msg) { log('error', '❌ Config xatolik:', msg); },
        network(msg) { log('error', '🌐 Network error:', msg); }
    },
    
    // ==================== UMUMIY ====================
    env(version) { log('log', '✅ MRDEV ENV yuklandi | Versiya:', version); },
    platformStart() { log('log', '🚀 MRDEV ishga tushmoqda...'); },
    platformReady() { log('log', '✅ MRDEV Platform tayyor'); },
    mrdevLoginLoaded() { log('log', '✅ MRDEV ID Login yuklandi'); },
    
    // ==================== DEBUG ====================
    debug: {
        log(...args) { log('log', '[DEBUG]', ...args); },
        warn(...args) { log('warn', '[DEBUG]', ...args); },
        error(...args) { log('error', '[DEBUG]', ...args); }
    }
};

// ==================== GLOBAL ====================
window.__LOG__ = logger;

export default logger;