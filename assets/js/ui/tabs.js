// ==================== MRDEV TAB SWITCHER v2.1 ====================
// i18n bilan to'liq integratsiya

import { renderAppGrid } from './grid.js';
import { t } from '../core/i18n.js';

let currentTab = 'all';

export const popularApps = [
    { name: "AI", icon: "ai.svg", path: "./popular/ai/index.html" },
    { name: "Jamoaviy-Doska", icon: "groupboard.svg", path: "./popular/groupboard/index.html" },
    { name: "LearnCode", icon: "learncode.svg", path: "./popular/learncode/index.html" },
    { name: "MrGram", icon: "mrgram.svg", path: "./popular/mrgram/index.html" },
    { name: "Xabarlar-Markazi", icon: "notifyhub.svg", path: "./popular/notifyhub/index.html" },
    { name: "Typing", icon: "typing.svg", path: "./popular/typing/index.html" },
    { name: "Xavfsizlik", icon: "security.svg", path: "./popular/security/index.html" },
    { name: "CodeStudio", icon: "codestudio.svg", path: "./popular/codestudio/index.html" },
    { name: "Videolarim", icon: "videohub.svg", path: "./popular/videohub/index.html" },
    { name: "ObHavo", icon: "weather.svg", path: "./popular/weather/index.html" },
    { name: "Eslatmalar", icon: "notes.svg", path: "./popular/notes/index.html" },
    { name: "Kun-Tartibi", icon: "todo.svg", path: "./popular/todo/index.html" }
];

export const miniApps = [
    { name: "Kalkulyator", icon: "calculator.svg", path: "./mini/calculator/index.html" },
    { name: "Bingo", icon: "bingo.svg", path: "./mini/bingo/index.html" },
    { name: "Doska", icon: "board.svg", path: "./mini/board/index.html" },
    { name: "Musiqalarim", icon: "music.svg", path: "./mini/music/index.html" },
    { name: "KopOyna", icon: "splitview.svg", path: "./mini/splitview/index.html" },
    { name: "Examer", icon: "examer.svg", path: "./mini/examer/index.html" },
    { name: "Soat", icon: "clock.svg", path: "./mini/clock/index.html" },
    { name: "Sekundnomer", icon: "stopwatch.svg", path: "./mini/stopwatch/index.html" },
    { name: "Taymer", icon: "timer.svg", path: "./mini/timer/index.html" },
    { name: "QR kod", icon: "qr.svg", path: "./mini/qr/index.html" }
];

// Tab subtitle'larini i18n kalitlari orqali olish
const tabSubtitleKeys = {
    'all':     'all_apps',
    'popular': 'popular_apps',
    'mini':    'mini_apps'
};

// ==================== SMOOTH GRID ANIMATION ====================
function animateGridIn(grid) {
    if (!grid) return;
    grid.style.display = 'block';
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(10px)';
    grid.style.transition = 'none';
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            grid.style.transition = 'opacity 0.24s ease, transform 0.24s ease';
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        });
    });
    setTimeout(() => {
        grid.style.transition = '';
        grid.style.opacity = '';
        grid.style.transform = '';
    }, 300);
}

export function switchTab(tabId) {
    currentTab = tabId;

    // Tab button'larini yangilash
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabId);
    });

    // Sidebar nav'ni yangilash
    document.querySelectorAll('.sidebar-nav-item').forEach(item => {
        item.classList.remove('active');
    });

    const activeMap = {
        'all':     'navAll',
        'popular': 'navPopular',
        'mini':    'navMini'
    };
    const activeNav = document.getElementById(activeMap[tabId]);
    if (activeNav) activeNav.classList.add('active');

    // Grid'larni ko'rsatish/yashirish — smooth animation bilan
    const allGrid         = document.getElementById('allGrid');
    const popularOnlyGrid = document.getElementById('popularOnlyGrid');
    const miniOnlyGrid    = document.getElementById('miniOnlyGrid');

    // Avval barchasini yashir (animatsiyasiz)
    [allGrid, popularOnlyGrid, miniOnlyGrid].forEach(grid => {
        if (grid) {
            grid.style.transition = 'none';
            grid.style.display = 'none';
            grid.style.opacity = '';
            grid.style.transform = '';
        }
    });

    // Keraklisini smooth animate qilib ko'rsat
    const targets = { all: allGrid, popular: popularOnlyGrid, mini: miniOnlyGrid };
    animateGridIn(targets[tabId]);

    // Sarlavhani i18n orqali yangilash
    updateSubtitle();
}

// Subtitle'ni joriy tilga mos yangilash
function updateSubtitle() {
    const pageSubtitle = document.getElementById('pageSubtitle');
    if (pageSubtitle) {
        const key = tabSubtitleKeys[currentTab] || 'all_apps';
        pageSubtitle.textContent = t(key);
        // data-i18n atributini saqlaymiz — applyTranslations() ham ishlashi uchun
        pageSubtitle.setAttribute('data-i18n', key);
    }
}

export function initTabs() {
    renderAppGrid(popularApps, 'popularGrid');
    renderAppGrid(miniApps, 'miniGrid');
    renderAppGrid(popularApps, 'popularOnlyList');
    renderAppGrid(miniApps, 'miniOnlyList');
    switchTab('all');

    // Til o'zgarganda subtitle ham yangilansin
    document.addEventListener('languageChanged', () => {
        updateSubtitle();
    });
}

export function getCurrentTab() {
    return currentTab;
}