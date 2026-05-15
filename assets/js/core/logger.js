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
        console.log('[ON] MRDEV Logger: ON');
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
            log('log', '[OK] Config loaded');
            log('log', '[FIREBASE] MAIN Project:', projectId);
            log('log', '[PKG] {} exists:', hasEnv);
        },
        error(msg) {
            log('error', '[ERR] Config error:', msg);
        },
        firebaseReady(projectId) {
            log('log', '[FIREBASE] Firebase Config:', projectId);
        }
    },
    
    // ==================== FIREBASE INIT ====================
    firebase: {
        start() { log('log', '[START] MRDEV Firebase Init v4.0'); },
        info(hostname, protocol, isLocalhost, isVercel, isDev, projectId, hasApiKey) {
            log('log', '[HOST] Hostname:', hostname);
            log('log', '[SECURE] Protocol:', protocol);
            log('log', '[LOCAL] Localhost:', isLocalhost);
            log('log', '[PKG] Vercel:', isVercel);
            log('log', '[FIREBASE] Project ID:', projectId);
            log('log', '[KEY] API Key:', hasApiKey ? '[OK] Mavjud' : '[FAIL] Topilmadi');
        },
        newApp(name) { log('log', '[NEW] Yangi Firebase app yaratildi:', name); },
        ready(auth, firestore, rtdb) {
            log('log', '[OK] Firebase servislari tayyor:');
            log('log', '   - Auth:', auth ? '[OK]' : '[FAIL]');
            log('log', '   - Firestore:', firestore ? '[OK]' : '[FAIL]');
            log('log', '   - Realtime DB:', rtdb ? '[OK]' : '[FAIL]');
        },
        done() {
            log('log', '[OK] MRDEV Firebase Init v4.0 tayyor');
            log('log', '---');
        },
        persistence(type) { log('log', '[SECURE] Persistence:', type); }
    },
    
    // ==================== AUTH ====================
    auth: {
        init() { log('log', '[START] [Auth] initAuth v6.0 boshlandi'); },
        start(version) { log('log', '[START] [Auth] initAuth', version, 'boshlandi'); },
        firebaseUser(email, uid) { log('log', '[FIREBASE] [Auth] Firebase user:', email, '| uid:', uid); },
        mrdevId(id) { log('log', '[OK] [Auth] MRDEV ID:', id); },
        mrdevIdNull() { log('warn', '[WARN]️ [Auth] MRDEV ID null qaytdi!'); },
        mrdevIdError(msg) { log('error', '[ERR] [Auth] saveUserMrdevId xatolik:', msg); },
        currentUser(name, mrdevId) { log('log', '[USER] [Auth] currentUser:', name, '| MRDEV ID:', mrdevId); },
        google(email) { log('log', '[OK] Firebase Auth:', email); },
        mrdev(email) { log('log', '[PKG] Lokal auth:', email); },
        none() { log('log', '[ERR] Hech qanday auth yo\'q'); },
        saved(email) { log('log', '[PKG] Saqlangan akkaunt:', email); },
        changed(email) { log('log', '[CHANGE] Auth o\'zgardi:', email || 'no user'); },
        centerLinked(id, email) { log('log', '[OK] ' + id + ' -> ' + email + ' markaziga qo\'shildi'); },
        firebaseLogin(email) { log('log', '[OK] Firebase Auth:', email); },
        loginOk() { log('log', '[OK] MRDEV Login muvaffaqiyatli'); },
        logout() { log('log', '[BYE] Auth logout'); }
    },
    
    // ==================== MRDEV LOGIN ====================
    mrdev: {
        searching(id) { log('log', '[SEARCH] MRDEV ID qidirilmoqda:', id); },
        found(email) { log('log', '[OK] Foydalanuvchi topildi:', email); },
        otpSent(key) { log('log', '[SEND] RTDB ga yuborildi:', key); },
        otpSentDev(code) { if (isLocal) log('log', '[KEY] DEV Parol:', code); },
        notify(id) { log('log', '[EMAIL] Parol xabarnomasi yuborildi:', id); },
        verifying(id) { log('log', '[VERIFY] Parol tekshirilmoqda:', id); },
        success() { log('log', '[OK] Parol to\'g\'ri!'); },
        wrong() { log('log', '[ERR] Noto\'g\'ri parol yoki muddati tugagan'); },
        loginOk() { log('log', '[OK] MRDEV Login muvaffaqiyatli!'); },
        loaded() { log('log', '[OK] MRDEV ID Login yuklandi'); }
    },
    
    // ==================== GOOGLE AUTH ====================
    google: {
        start() { log('log', '[KEY] [GoogleAuth] Google login...'); },
        success(uid, email) { log('log', '[KEY] [GoogleAuth] Google login OK:', uid, email); },
        newUser() { log('log', '[DOC] [GoogleAuth] Yangi Firestore doc yaratildi'); },
        existingUser() { log('log', '[DOC] [GoogleAuth] Mavjud Firestore doc yangilandi'); },
        mrdevId(id) { log('log', '[ID] [GoogleAuth] MRDEV ID:', id); },
        mrdevIdError(msg) { log('warn', '[GoogleAuth] MRDEV ID xatolik:', msg); },
        localSaved(mrdevId) { log('log', '[OK] [GoogleAuth] mrdev_local_auth saqlandi, mrdevId:', mrdevId); },
        error(code, msg) { log('error', '[GoogleAuth] signInWithGoogle xatolik:', code, msg); }
    },
    
    // ==================== EMAIL AUTH ====================
    email: {
        loginStart() { log('log', '[EMAIL] [EmailAuth] Email login...'); },
        loginSuccess(uid) { log('log', '[OK] [EmailAuth] Firebase login OK:', uid); },
        mrdevId(id) { log('log', '[ID] [EmailAuth] MRDEV ID:', id); },
        mrdevIdError(msg) { log('warn', '[EmailAuth] MRDEV ID xatosi:', msg); },
        registerStart() { log('log', '[REG] [EmailAuth] Email register...'); },
        registerSuccess(uid) { log('log', '[OK] [EmailAuth] Firebase register OK:', uid); },
        docCreated() { log('log', '[DOC] [EmailAuth] Firestore doc yaratildi'); },
        newMrdevId(id) { log('log', '[ID] [EmailAuth] Yangi MRDEV ID:', id); },
        error(code, msg) { log('error', '[EmailAuth] xatolik:', code, msg); }
    },
    
    // ==================== NOTIFICATIONS ====================
    notif: {
        firebaseUser(uid) { log('log', '[FIREBASE] [PassNotif] Firebase Auth user:', uid); },
        localUser(uid) { log('log', '[PKG] [PassNotif] Local auth user:', uid); },
        localParseError(msg) { log('warn', '[PassNotif] Local auth parse xatolik:', msg); },
        searching(uid, email) { log('log', '[SEARCH] [PassNotif] Xabarlar qidirilmoqda... uid:', uid, 'email:', email); },
        found(count) { log('log', '[LIST] [PassNotif]', count, 'ta xabar topildi'); },
        settingsChanged(enabled) { log('log', '[PassNotif] Notifications enabled:', enabled); },
        error(msg) { log('error', '[ERR] [PassNotif] Load xatolik:', msg); }
    },
    
    // ==================== MRDEV CORE ====================
    core: {
        saveStart(uid, email, linkedTo) { log('log', '[SEARCH] [MRDev] saveUserMrdevId:', { uid, email, linkedTo }); },
        existing(id) { log('log', '[OK] [MRDev] Mavjud MRDEV ID:', id); },
        updateError(msg) { log('warn', '[MRDev] updateDoc xatolik:', msg); },
        newUpdate(id) { log('log', '[NEW] [MRDev] Yangi MRDEV ID (update):', id); },
        newCreate(id) { log('log', '[NEW] [MRDev] Yangi MRDEV ID (create):', id); },
        error(msg) { log('error', '[ERR] [MRDev] saveUserMrdevId xatolik:', msg); },
        loginStart(id) { log('log', '[SEARCH] [MRDev] loginWithMrdevId:', id); },
        loginFound(email, linkedTo) { log('log', '[OK] [MRDev] Foydalanuvchi topildi:', email, '| linkedTo:', linkedTo || 'yo\'q'); },
        loginError(msg) { log('error', '[ERR] [MRDev] loginWithMrdevId xatolik:', msg); },
        linkStart(id) { log('log', '[LINK] [MRDev] getLinkedAccount:', id); },
        linkAccount(uid, target) { log('log', '[LINK] [MRDev] linkAccount:', uid, '→', target); },
        linkSuccess(uid, target) { log('log', '[OK] [MRDev] Hisob ulandi:', uid, '→', target); },
        linkError(msg) { log('error', '[ERR] [MRDev] linkAccount xatolik:', msg); },
        unlink(uid) { log('log', '[UNLINK] [MRDev] unlinkAccount:', uid); },
        unlinkSuccess() { log('log', '[OK] [MRDev] Ulanish o\'chirildi'); },
        unlinkError(msg) { log('error', '[ERR] [MRDev] unlinkAccount xatolik:', msg); },
        noUser() { log('warn', '[MRDev] saveUserMrdevId: user.uid mavjud emas'); },
        sendCode(id) { log('log', '[SEND] [MRDev] sendPassCode:', id); },
        sendCodeSuccess(email) { log('log', '[OK] [MRDev] Pass code yuborildi'); },
        sendCodeError(msg) { log('error', '[ERR] [MRDev] sendPassCode xatolik:', msg); },
        verifyCode(id) { log('log', '[VERIFY] [MRDev] verifyPassCode:', id); },
        verifySuccess() { log('log', '[OK] [MRDev] Pass code tasdiqlandi'); },
        verifyError(msg) { log('error', '[ERR] [MRDev] verifyPassCode xatolik:', msg); }
    },
    
    // ==================== BOARD ====================
    board: {
        init() { log('log', '[THEME] MRDEV Board ishga tushmoqda...'); },
        ready(uid) { log('log', '[OK] Board tayyor! UID:', uid); },
        save(uid) { log('log', '[SAVE] Saqlash UID:', uid); },
        load(uid) { log('log', '[CLOUD]️ Yuklash UID:', uid); },
        ui(name) { log('log', '[USER] UI yangilandi:', name); },
        guest() { log('log', '[USER] Mehmon'); },
        cloudSaveError(e) { log('error', 'Cloud save error:', e); },
        cloudLoadError(e) { log('error', 'Cloud load error:', e); },
        dropdownError(e) { log('warn', 'Dropdown init failed:', e); }
    },
    
    // ==================== LOCAL AUTH ====================
    localAuth: {
        check(found) { log('log', '[SEARCH] Local auth:', found ? 'topildi' : 'yo\'q'); },
        found(email) { log('log', '[OK] Local auth topildi:', email); },
        saved(uid) { log('log', '[SAVE] Local auth saqlandi:', uid); }
    },
    
    // ==================== NOTIF-PASS ====================
    notifPass: {
        loaded() {
            log('log', '[OK] MRDEV Notif-Pass yuklandi');
            log('log', '---');
        },
        userSave(id) { log('log', '[FIX] MRDEV ID saqlash:', id); },
        passwordUpdated() { log('log', '[KEY] Yangi xavfsiz parol yaratildi'); },
        created(id) { log('log', '[NEW] Yangi MRDEV ID:', id); }
    },
    
    // ==================== SIDEBAR & UI ====================
    ui: {
        sidebarInit() { log('log', '[MOBILE] Sidebar initializing...'); },
        userMenuInit() { log('log', '[USER] User menu initializing...'); },
        dropdownInit(type) { log('log', '[LIST] Dropdown init:', type); },
        themeChanged(theme) { log('log', '[THEME] Theme changed:', theme); },
        languageChanged(lang) { log('log', '[LANG] Language changed:', lang); }
    },
    
    // ==================== SETTINGS ====================
    settings: {
        init() { log('log', '[SETTINGS]️ Settings initializing...'); },
        cacheCleared(size) { log('log', '[CACHE]️ Cache cleared:', size, 'items'); },
        themeSaved(theme) { log('log', '[SAVE] Theme saved:', theme); },
        languageSaved(lang) { log('log', '[SAVE] Language saved:', lang); },
        notificationsSaved(enabled) { log('log', '[NOTIF] Notifications:', enabled ? 'ON' : 'OFF'); }
    },
    
    // ==================== XATOLIKLAR ====================
    error: {
        firebase(msg) { log('error', '[ERR] Firebase xatolik:', msg); },
        cloud(msg) { log('error', 'Cloud error:', msg); },
        dropdown(msg) { log('warn', 'Dropdown init failed:', msg); },
        verify(msg) { log('error', '[ERR] Verifikatsiya xatolik:', msg); },
        notif(msg) { log('error', '[ERR] Notif xatolik:', msg); },
        auth(msg) { log('warn', 'Auth xatolik:', msg); },
        config(msg) { log('error', '[ERR] Config xatolik:', msg); },
        network(msg) { log('error', '[LANG] Network error:', msg); }
    },
    
    // ==================== UMUMIY ====================
    env(version) { log('log', '[OK] MRDEV ENV yuklandi | Versiya:', version); },
    platformStart() { log('log', '[START] MRDEV ishga tushmoqda...'); },
    platformReady() { log('log', '[OK] MRDEV Platform tayyor'); },
    mrdevLoginLoaded() { log('log', '[OK] MRDEV ID Login yuklandi'); },
    
    // ==================== MULTI ACCOUNT ====================
    multiAccount: {
        noUid() { log('warn', '[MultiAccount] addOrUpdateAccount: user.uid yo\'q'); },
        saved(uid, mrdevId) { log('log', '[SAVE] [MultiAccount] Saqlandi:', uid, '| mrdevId:', mrdevId || '(yo\'q)'); },
        cleared() { log('log', '[MultiAccount] Barcha akkauntlar tozalandi'); }
    },

    // ==================== FIREBASE HELPER ====================
    firebaseHelper: {
        persistenceError(msg) { log('warn', '[FirebaseHelper] Persistence error:', msg); },
        initError(e) { log('error', '[FirebaseHelper] init error:', e); },
        localNotLoggedIn() { log('warn', '[FirebaseHelper] local auth: isLoggedIn false'); },
        localNoUid() { log('warn', '[FirebaseHelper] local auth: uid yo\'q'); },
        localExpired() { log('warn', '[FirebaseHelper] local auth muddati tugagan'); },
        localAuthError(msg) { log('warn', '[FirebaseHelper] getLocalAuthUser xatolik:', msg); },
        getUserIdError(msg) { log('warn', '[FirebaseHelper] getUserId local parse xatolik:', msg); },
        localSaveFailed(msg) { log('warn', '[FirebaseHelper] Local save failed:', msg); },
        cloudSaveFailed(msg) { log('warn', '[FirebaseHelper] Cloud save failed:', msg); },
        cloudLoadFailed(msg) { log('warn', '[FirebaseHelper] Cloud load failed:', msg); },
        cloudListenerError(msg) { log('warn', '[FirebaseHelper] Cloud listener error:', msg); },
        deleteError(msg) { log('warn', '[FirebaseHelper] Delete error:', msg); },
        clearError(msg) { log('warn', '[FirebaseHelper] Clear error:', msg); }
    },

    // ==================== AUTH HELPER ====================
    authHelper: {
        parseError(msg) { log('warn', '[AuthHelper] getCurrentUser local parse xatolik:', msg); },
        mrdevIdError(msg) { log('warn', '[AuthHelper] getMrdevId xatolik:', msg); },
        deprecated(email, mrdevId) { log('log', '[AuthHelper] addMrdevIdToCenter chaqirildi (deprecated):', email, mrdevId); }
    },

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

