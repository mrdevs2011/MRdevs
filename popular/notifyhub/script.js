import { getTheme, setTheme, toggleTheme } from '../../assets/js/core/global-settings.js';
/**
 * NOTIFY HUB - Main Application
 * Version: 2.1.0 (MRDEV Integration Fix)
 * Author: MRDEV Team
 */

// ========================================
// FIREBASE CONFIGURATION
// FIX v2.1: Hardcoded placeholder o'rniga ENV dan o'qish
// ========================================
const firebaseConfig = {
    apiKey:            ENV.VITE_SECONDARY_API_KEY             || '',
    authDomain:        ENV.VITE_SECONDARY_AUTH_DOMAIN         || '',
    databaseURL:       ENV.VITE_SECONDARY_DATABASE_URL        || '',
    projectId:         ENV.VITE_SECONDARY_PROJECT_ID          || '',
    storageBucket:     ENV.VITE_SECONDARY_STORAGE_BUCKET      || '',
    messagingSenderId: ENV.VITE_SECONDARY_MESSAGING_SENDER_ID || '',
    appId:             ENV.VITE_SECONDARY_APP_ID              || ''
};

if (!firebaseConfig.apiKey) {
    console.error('❌ notifyhub/script: ENV kalitlar topilmadi! (VITE_SECONDARY_API_KEY)');
}

// Initialize Firebase (CDN compat mode)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // mavjud instance ishlatiladi
}
const database = firebase.database();

// ========================================
// GLOBAL VARIABLES
// ========================================
let currentMessage = "";
let currentScale = 1;
let initialDistance = 0;

// ========================================
// THEME MANAGEMENT
// ========================================

// ========================================
// MODE SWITCHING
// ========================================
function switchToAdmin() {
    document.getElementById('modeSelector').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

function switchToMonitor() {
    document.getElementById('modeSelector').style.display = 'none';
    document.getElementById('monitorPage').style.display = 'flex';
    startMonitorUpdates();
}

function checkAdminAccess() {
    const pin = prompt("Admin PIN kodini kiriting:");
    if (pin === "byMR") {
        switchToAdmin();
        loadAllData();
    } else if (pin !== null) {
        alert("Noto'g'ri PIN kod!");
    }
}

// ========================================
// DATA MANAGEMENT
// ========================================
// Weekly Data
function saveWeekly() {
    const day = document.getElementById('weekDay').value;
    const start = document.getElementById('weekStart').value;
    const end = document.getElementById('weekEnd').value;
    const msg = document.getElementById('weekMsg').value;
    
    if (!start || !end || !msg) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }
    
    const newRef = database.ref(`system/weekly/${day}`).push();
    newRef.set({
        start: start,
        end: end,
        msg: msg,
        createdAt: Date.now()
    }).then(() => {
        document.getElementById('weekStart').value = '';
        document.getElementById('weekEnd').value = '';
        document.getElementById('weekMsg').value = '';
        loadWeeklyList();
    }).catch(error => console.error("Error:", error));
}

function loadWeeklyList() {
    database.ref('system/weekly').once('value', (snapshot) => {
        const data = snapshot.val() || {};
        const container = document.getElementById('weeklyList');
        container.innerHTML = '';
        
        Object.keys(data).forEach(day => {
            Object.keys(data[day]).forEach(key => {
                const item = data[day][key];
                const dayName = getDayName(parseInt(day));
                const div = createListItem(
                    `${dayName}: ${item.msg}`,
                    `${item.start} - ${item.end}`,
                    () => deleteWeekly(day, key)
                );
                container.appendChild(div);
            });
        });
    });
}

function deleteWeekly(day, key) {
    database.ref(`system/weekly/${day}/${key}`).remove().then(() => loadWeeklyList());
}

// Daily Data
function saveDaily() {
    const date = document.getElementById('dailyDate').value;
    const start = document.getElementById('dailyStart').value;
    const end = document.getElementById('dailyEnd').value;
    const msg = document.getElementById('dailyMsg').value;
    
    if (!date || !start || !end || !msg) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }
    
    const newRef = database.ref('system/daily').push();
    newRef.set({
        date: date,
        start: start,
        end: end,
        msg: msg,
        createdAt: Date.now()
    }).then(() => {
        document.getElementById('dailyDate').value = '';
        document.getElementById('dailyStart').value = '';
        document.getElementById('dailyEnd').value = '';
        document.getElementById('dailyMsg').value = '';
        loadDailyList();
    });
}

function loadDailyList() {
    database.ref('system/daily').once('value', (snapshot) => {
        const data = snapshot.val() || {};
        const container = document.getElementById('dailyList');
        container.innerHTML = '';
        
        Object.keys(data).forEach(key => {
            const item = data[key];
            const div = createListItem(
                item.msg,
                `${item.date} | ${item.start} - ${item.end}`,
                () => deleteDaily(key)
            );
            container.appendChild(div);
        });
    });
}

function deleteDaily(key) {
    database.ref(`system/daily/${key}`).remove().then(() => loadDailyList());
}

// SOS Management
function activateSOS(active) {
    if (active) {
        const msg = document.getElementById('sosMsg').value || "FAVQULODDA HOLAT!";
        database.ref('system/emergency').set({
            active: true,
            msg: msg,
            startTime: Date.now()
        });
        
        database.ref('system/sos_history').push({
            msg: msg,
            time: new Date().toLocaleString('uz-UZ'),
            timestamp: Date.now()
        });
        
        loadSOSHistory();
    } else {
        database.ref('system/emergency').update({ active: false });
    }
}

function loadSOSHistory() {
    database.ref('system/sos_history').once('value', (snapshot) => {
        const data = snapshot.val() || {};
        const container = document.getElementById('sosHistoryList');
        container.innerHTML = '';
        
        Object.keys(data).reverse().forEach(key => {
            const item = data[key];
            const div = createListItem(
                item.msg,
                item.time,
                () => deleteSOSHistory(key)
            );
            container.appendChild(div);
        });
    });
}

function deleteSOSHistory(key) {
    database.ref(`system/sos_history/${key}`).remove().then(() => loadSOSHistory());
}

// Load All History
function loadAllHistory() {
    const container = document.getElementById('allHistoryList');
    container.innerHTML = '<div class="list-item">Yuklanmoqda...</div>';
    
    let allItems = [];
    
    // Get weekly
    database.ref('system/weekly').once('value', (snapshot) => {
        const weekly = snapshot.val() || {};
        Object.keys(weekly).forEach(day => {
            Object.keys(weekly[day]).forEach(key => {
                const item = weekly[day][key];
                allItems.push({
                    type: 'Haftalik',
                    title: item.msg,
                    time: `${getDayName(parseInt(day))} ${item.start}-${item.end}`,
                    timestamp: item.createdAt || 0
                });
            });
        });
        
        // Get daily
        database.ref('system/daily').once('value', (snapshot) => {
            const daily = snapshot.val() || {};
            Object.keys(daily).forEach(key => {
                const item = daily[key];
                allItems.push({
                    type: 'E\'lon',
                    title: item.msg,
                    time: `${item.date} ${item.start}-${item.end}`,
                    timestamp: item.createdAt || 0
                });
            });
            
            // Get SOS history
            database.ref('system/sos_history').once('value', (snapshot) => {
                const sos = snapshot.val() || {};
                Object.keys(sos).forEach(key => {
                    const item = sos[key];
                    allItems.push({
                        type: 'SOS',
                        title: item.msg,
                        time: item.time,
                        timestamp: item.timestamp || 0
                    });
                });
                
                // Sort by timestamp
                allItems.sort((a, b) => b.timestamp - a.timestamp);
                
                // Render
                container.innerHTML = '';
                allItems.forEach(item => {
                    const div = createListItem(
                        `<span class="list-item-type">[${item.type}]</span> ${item.title}`,
                        item.time
                    );
                    container.appendChild(div);
                });
                
                if (allItems.length === 0) {
                    container.innerHTML = '<div class="list-item">Hech qanday ma\'lumot topilmadi</div>';
                }
            });
        });
    });
}

// ========================================
// MONITOR LOGIC
// ========================================
let monitorInterval = null;

function startMonitorUpdates() {
    updateMonitor();
    monitorInterval = setInterval(updateMonitor, 1000);
    
    // Listen for SOS changes
    database.ref('system/emergency').on('value', (snapshot) => {
        const emData = snapshot.val() || { active: false };
        if (emData.active) {
            document.getElementById('monitorPage').classList.add('sos-active');
            updateSOSTimer(emData.startTime);
        } else {
            document.getElementById('monitorPage').classList.remove('sos-active');
        }
    });
}

function updateMonitor() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const weekDay = now.getDay();
    
    // Update clock
    document.getElementById('monitorClock').innerText = now.toLocaleTimeString('uz-UZ', { hour12: false });
    
    // Check SOS first
    database.ref('system/emergency').once('value', (snapshot) => {
        const emData = snapshot.val() || { active: false };
        
        if (emData.active) {
            updateMonitorMessage(emData.msg, '#ef4444');
            updateMonitorStatus('exclamation-triangle', '#ef4444');
            return;
        }
        
        // Check weekly schedules
        database.ref(`system/weekly/${weekDay}`).once('value', (snapshot) => {
            const weeklyData = snapshot.val() || {};
            let found = false;
            
            Object.values(weeklyData).forEach(item => {
                const startMin = timeToMinutes(item.start);
                const endMin = timeToMinutes(item.end);
                
                if (currentMinutes >= startMin && currentMinutes < endMin) {
                    updateMonitorMessage(item.msg, '#6366f1');
                    updateMonitorStatus('clock', '#6366f1');
                    found = true;
                }
            });
            
            if (!found) {
                // Check daily schedules
                database.ref('system/daily').once('value', (snapshot) => {
                    const dailyData = snapshot.val() || {};
                    let dailyFound = false;
                    
                    Object.values(dailyData).forEach(item => {
                        if (item.date === currentDate) {
                            const startMin = timeToMinutes(item.start);
                            const endMin = timeToMinutes(item.end);
                            
                            if (currentMinutes >= startMin && currentMinutes < endMin) {
                                updateMonitorMessage(item.msg, '#a855f7');
                                updateMonitorStatus('bullhorn', '#a855f7');
                                dailyFound = true;
                            }
                        }
                    });
                    
                    if (!dailyFound) {
                        updateMonitorMessage("Hozircha hech qanday e'lon yo'q", '#71717a');
                        updateMonitorStatus('circle', '#71717a');
                    }
                });
            }
        });
    });
}

function updateMonitorMessage(msg, color) {
    const messageEl = document.getElementById('monitorMessage');
    
    if (currentMessage !== msg) {
        messageEl.style.opacity = '0';
        setTimeout(() => {
            messageEl.innerText = msg;
            messageEl.classList.remove('marquee');
            
            // Check if text overflows
            if (messageEl.scrollWidth > window.innerWidth) {
                const speed = Math.max(10, msg.length * 0.15);
                messageEl.style.setProperty('--speed', `${speed}s`);
                messageEl.classList.add('marquee');
                messageEl.style.textAlign = 'left';
            } else {
                messageEl.style.textAlign = 'center';
            }
            
            messageEl.style.opacity = '1';
            currentMessage = msg;
        }, 300);
    }
}

function updateMonitorStatus(icon, color) {
    const statusEl = document.getElementById('monitorStatus');
    statusEl.innerHTML = `<i class="fas fa-${icon}" style="color: ${color}"></i>`;
    statusEl.style.borderColor = color;
}

function updateSOSTimer(startTime) {
    const timerEl = document.getElementById('sosTimer');
    if (!timerEl) return;
    
    const diff = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(diff / 60)).padStart(2, '0');
    const seconds = String(diff % 60).padStart(2, '0');
    timerEl.innerText = `${minutes}:${seconds}`;
}

// ========================================
// HELPER FUNCTIONS
// ========================================
function timeToMinutes(time) {
    if (!time) return -1;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
}

function getDayName(day) {
    const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba'];
    return days[day];
}

function createListItem(title, subtitle, onDelete = null) {
    const div = document.createElement('div');
    div.className = 'list-item';
    
    const content = document.createElement('div');
    content.className = 'list-item-content';
    
    const titleSpan = document.createElement('div');
    titleSpan.className = 'list-item-title';
    titleSpan.innerHTML = title;
    
    const subtitleSpan = document.createElement('div');
    subtitleSpan.className = 'list-item-subtitle';
    subtitleSpan.innerText = subtitle;
    
    content.appendChild(titleSpan);
    content.appendChild(subtitleSpan);
    div.appendChild(content);
    
    if (onDelete) {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'list-item-delete';
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteBtn.onclick = onDelete;
        div.appendChild(deleteBtn);
    }
    
    return div;
}

function loadAllData() {
    loadWeeklyList();
    loadDailyList();
    loadSOSHistory();
    loadAllHistory();
}

// ========================================
// TAB MANAGEMENT
// ========================================
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${tabId}Tab`).classList.add('active');
            
            // Reload data for history tab
            if (tabId === 'history') {
                loadAllHistory();
            }
        });
    });
}

// ========================================
// ZOOM FUNCTIONALITY FOR MONITOR
// ========================================
function initZoom() {
    const monitorContent = document.getElementById('monitorContent');
    if (!monitorContent) return;
    
    monitorContent.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            initialDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
        }
    });
    
    monitorContent.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && initialDistance > 0) {
            const distance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            const scale = distance / initialDistance;
            let newScale = Math.min(Math.max(0.5, currentScale * scale), 5);
            monitorContent.style.transform = `scale(${newScale})`;
        }
    });
    
    monitorContent.addEventListener('touchend', () => {
        if (monitorContent.style.transform) {
            const matrix = new WebKitCSSMatrix(monitorContent.style.transform);
            currentScale = matrix.a;
            initialDistance = 0;
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const _t = getTheme(); if (_t === 'dark') document.body.classList.add('dark'); else document.body.classList.remove('dark');
    initTabs();
    initZoom();
    
    // Theme button handler
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }
    
    // Update SOS timer every second
    setInterval(() => {
        database.ref('system/emergency').once('value', (snapshot) => {
            const emData = snapshot.val() || {};
            if (emData.active && emData.startTime) {
                updateSOSTimer(emData.startTime);
            }
        });
    }, 1000);
});