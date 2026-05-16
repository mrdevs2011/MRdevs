// ==================== MRDEV DROPDOWN CONFIG v1.0 ====================
// Bu fayl faqat ma'lumotlar va mantiqiy funksiyalarni saqlaydi.
// DOM manipulyatsiyasi yo'q — faqat sof konfiguratsiya.

// =====================================================================
// SECTION DETECTION
// =====================================================================

/**
 * Joriy URL ga qarab qaysi bo'limddaligini aniqlaydi.
 * @returns {'root'|'mini'|'settings'}
 */
export function detectSection() {
    const path = window.location.pathname;

    if (path.includes('/settings')) return 'settings';

    // Mini ilovalar ichidagi sahifalar
    if (
        path.includes('/mini/') ||
        path.match(/\/(calculator|bingo|board|music|splitview|examer|clock|stopwatch|timer|qr)(\/?$|\/)/)
    ) return 'mini';

    return 'root';
}

// =====================================================================
// BASE PATH
// =====================================================================

export function getBasePath() {
    const p = window.location.pathname;
    if (p.includes('/mini/') || p.includes('/popular/')) return '../..';
    if (p.includes('/settings')) return '..';
    return '.';
}

// =====================================================================
// ILOVALAR RO'YXATI
// =====================================================================

export function getAppsConfig(base) {
    return {
        popular: [
            { name: 'AI',         icon: 'ai',         path: `${base}/popular/ai/` },
            { name: 'GroupBoard', icon: 'groupboard',  path: `${base}/popular/groupboard/` },
            { name: 'LearnCode',  icon: 'learncode',   path: `${base}/popular/learncode/` },
            { name: 'MrGram',     icon: 'mrgram',      path: `${base}/popular/mrgram/` },
            { name: 'NotifyHub',  icon: 'notifyhub',   path: `${base}/popular/notifyhub/` },
            { name: 'Typing',     icon: 'typing',      path: `${base}/popular/typing/` },
            { name: 'Security',   icon: 'security',    path: `${base}/popular/security/` },
            { name: 'CodeStudio', icon: 'codestudio',  path: `${base}/popular/codestudio/` },
            { name: 'VideoHub',   icon: 'videohub',    path: `${base}/popular/videohub/` },
            { name: 'Weather',    icon: 'weather',     path: `${base}/popular/weather/` },
            { name: 'Notes',      icon: 'notes',       path: `${base}/popular/notes/` },
            { name: 'Todo',       icon: 'todo',        path: `${base}/popular/todo/` },
        ],
        mini: [
            { name: 'Calculator', icon: 'calculator',  path: `${base}/mini/calculator/` },
            { name: 'Bingo',      icon: 'bingo',       path: `${base}/mini/bingo/` },
            { name: 'Board',      icon: 'board',       path: `${base}/mini/board/` },
            { name: 'Music',      icon: 'music',       path: `${base}/mini/music/` },
            { name: 'SplitView',  icon: 'splitview',   path: `${base}/mini/splitview/` },
            { name: 'Examer',     icon: 'examer',      path: `${base}/mini/examer/` },
            { name: 'Clock',      icon: 'clock',       path: `${base}/mini/clock/` },
            { name: 'Stopwatch',  icon: 'stopwatch',   path: `${base}/mini/stopwatch/` },
            { name: 'Timer',      icon: 'timer',       path: `${base}/mini/timer/` },
            { name: 'QR Code',    icon: 'qr',          path: `${base}/mini/qr/` },
        ],
    };
}

// =====================================================================
// PROVIDER BADGE MA'LUMOTLARI
// =====================================================================

export function getProviderInfo(provider) {
    const map = {
        'google.com': { label: 'Google',   color: '#EA4335', icon: providerIcons.google },
        'google':     { label: 'Google',   color: '#EA4335', icon: providerIcons.google },
        'password':   { label: 'Email',    color: '#8B5CF6', icon: providerIcons.email  },
        'email':      { label: 'Email',    color: '#8B5CF6', icon: providerIcons.email  },
        'mrdev':      { label: 'MRDEV ID', color: '#2a7de1', icon: providerIcons.mrdev  },
    };
    return map[provider] || { label: provider || 'MRDEV', color: '#6B7280', icon: providerIcons.mrdev };
}

const providerIcons = {
    google: `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>`,
    email: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
    </svg>`,
    mrdev: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>`,
};

// =====================================================================
// SVG ICON KUTUBXONASI
// =====================================================================

export const Icons = {
    bell: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>`,
    info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>`,
    settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>`,
    logout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>`,
    chevronRight: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>`,
    check: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    shield: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
};

// =====================================================================
// QURILMA / HISOB TIPI IDENTIFIKATSIYASI
// =====================================================================

/**
 * Provider string ga qarab chiroyli display nomi va ikonkasini qaytaradi.
 */
export function getDeviceDisplay(account) {
    const provInfo = getProviderInfo(account.provider);
    const name = account.displayName || account.email?.split('@')[0] || 'Foydalanuvchi';
    return {
        label: `${name} — ${provInfo.label} bilan`,
        providerLabel: provInfo.label,
        color: provInfo.color,
        icon: provInfo.icon,
    };
}