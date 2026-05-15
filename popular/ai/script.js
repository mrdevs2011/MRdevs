// ==================== MR AI SCRIPT v3.0 ====================
// MRDEV bilan to'liq integratsiya — alohida login yo'q
// MRDev ID / Email / Google auth orqali kirgan foydalanuvchi avtomatik taniladi

import { app, auth, db } from '../../assets/js/core/firebase-init.js';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
    collection, doc, getDoc, setDoc, addDoc, getDocs,
    onSnapshot, deleteDoc, query, orderBy, serverTimestamp,
    limit, where
} from 'firebase/firestore';

// ==================== AI PROVAYDERLAR ====================
const PROVIDERS = {
    chat:    { url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' },
    summary: { url: 'https://api.groq.com/openai/v1/chat/completions', model: 'llama-3.3-70b-versatile' }
};

// ==================== REJIMLAR ====================
const MODES = {
    fast: {
        label: 'Tezkor',
        icon: 'fa-bolt',
        temperature: 0.9,
        max_tokens: 500,
        prompt: 'TEZKOR rejim: juda qisqa va lo\'nda javob ber. 3-4 gapdan oshmasin.'
    },
    think: {
        label: 'Fikrlovchi',
        icon: 'fa-brain',
        temperature: 0.5,
        max_tokens: 2000,
        prompt: 'FIKRLOVCHI rejim: do\'stona, qadam-baqadam tahlil qil.'
    },
    expert: {
        label: 'Ekspert',
        icon: 'fa-star',
        temperature: 0.3,
        max_tokens: 4000,
        prompt: 'EKSPERT rejim: LaTeX formulalar ishlat, chuqur tahlil qil.'
    }
};

// ==================== XOTIRA SOZLAMALARI ====================
const MEM = {
    LEVELS:              { 0: { aggregateSize: 5 }, 1: { aggregateSize: 5 }, 2: { aggregateSize: 3 } },
    MAX_CONTEXT_LEN:     2000,
    MIN_IMPORTANCE:      0.3
};

// ==================== GLOBAL STATE ====================
let currentUser     = null;
let currentChatId   = null;
let chatHistory     = [];
let abortController = null;
let currentMode     = 'fast';
let memCache        = { ctx: '', ts: 0 };
let apiKeys         = [];
let keyIndex        = 0;

// TTS state
let currentUtterance = null;
let audioInterval    = null;
let isAudioPaused    = false;
let currentTTSBtn    = null;
let currentTTSText   = '';

// ==================== ENV / API KEY ====================
function getEnvConfig() {
    // Vite build: {}, fallback: window.__ENV__
    try {
        if (typeof import.meta !== 'undefined' && {}) {
            return {};
        }
    } catch(e) {}
    return window.__ENV__ || {};
}

// ==================== LOCAL AUTH READER ====================
// MRDEV main saytida login qilingan session ni o'qiydi
function getMrdevLocalUser() {
    try {
        const raw = localStorage.getItem('mrdev_local_auth');
        if (!raw) return null;
        const d = JSON.parse(raw);
        if (!d || !d.isLoggedIn || !d.uid) return null;
        const hoursOld = (Date.now() - (d.loginTime || 0)) / 3600000;
        if (hoursOld > 72) { localStorage.removeItem('mrdev_local_auth'); return null; }
        return d;
    } catch { return null; }
}

// ==================== REDIRECT ====================
function showRedirectAndGo() {
    const scr = document.getElementById('redirect-screen');
    if (scr) scr.style.display = 'flex';
    setTimeout(() => { window.location.href = '../../'; }, 1800);
}

// ==================== AUTH INIT ====================
onAuthStateChanged(auth, async firebaseUser => {
    let user = firebaseUser;

    // Firebase auth yo'q — local storage ni tekshir
    if (!user) {
        const local = getMrdevLocalUser();
        if (local) {
            user = {
                uid:           local.uid,
                email:         local.email || '',
                displayName:   local.displayName || local.email?.split('@')[0] || 'MRDEV User',
                photoURL:      local.photoURL || null,
                mrdevId:       local.mrdevId || '',
                _isLocalOnly:  true
            };
        }
    }

    if (!user) {
        // Login qilinmagan → MRDEV bosh sahifaga yo'naltir
        showRedirectAndGo();
        return;
    }

    // MRDEV user info ni boyitamiz
    if (!user.mrdevId) {
        const local = getMrdevLocalUser();
        if (local) user.mrdevId = local.mrdevId || '';
    }

    currentUser = user;
    await onUserReady();
});

// ==================== USER READY ====================
async function onUserReady() {
    // Redirect screen ni yashir
    document.getElementById('redirect-screen').style.display = 'none';
    document.getElementById('app-wrapper').style.display = 'flex';

    // Sidebar user info
    renderSidebarUser();

    // API kalitlarni yuklash
    await loadAPIKeys();

    // Firestore user doc
    await ensureUserDoc();

    // Chat tarixini yuklash
    loadHistory();

    // Welcome screen
    showWelcome();
}

// ==================== SIDEBAR USER RENDER ====================
function renderSidebarUser() {
    if (!currentUser) return;

    const nameEl   = document.getElementById('s-name');
    const emailEl  = document.getElementById('s-email');
    const badgeEl  = document.getElementById('s-badge');
    const avatarEl = document.getElementById('s-avatar');

    const displayName = currentUser.displayName || currentUser.email?.split('@')[0] || 'User';
    const displayEmail = currentUser.email || '';

    if (nameEl)  nameEl.textContent  = displayName;
    if (emailEl) emailEl.textContent = displayEmail;

    if (badgeEl) {
        if (currentUser.mrdevId) {
            badgeEl.textContent = `MR ID: ${currentUser.mrdevId}`;
            badgeEl.style.display = 'inline-flex';
        } else {
            badgeEl.style.display = 'none';
        }
    }

    if (avatarEl) {
        if (currentUser.photoURL) {
            avatarEl.innerHTML = `<img src="${currentUser.photoURL}" alt="${displayName}">`;
        } else {
            avatarEl.textContent = displayName.charAt(0).toUpperCase();
        }
    }

    // Header welcome
    const userGreet = document.getElementById('header-user');
    if (userGreet) {
        userGreet.textContent = displayName.split(' ')[0];
    }
}

// ==================== USER DOC ====================
async function ensureUserDoc() {
    if (!currentUser || currentUser._isLocalOnly) return;
    try {
        const ref  = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
            await setDoc(ref, {
                uid:          currentUser.uid,
                email:        currentUser.email || '',
                displayName:  currentUser.displayName || '',
                photoURL:     currentUser.photoURL || null,
                globalSummary: '',
                userProfile:  {},
                createdAt:    serverTimestamp(),
                lastUpdated:  serverTimestamp()
            });
        }
    } catch (e) {
        console.warn('ensureUserDoc:', e.message);
    }
}

// ==================== API KEY MANAGER ====================
async function loadAPIKeys() {
    const env = getEnvConfig();

    // 5 ta ENV keyni tekshiradi: VITE_GROQ_API_KEY_1 ... VITE_GROQ_API_KEY_5
    const envKeys = [];
    for (let i = 1; i <= 5; i++) {
        const k = env[`VITE_GROQ_API_KEY_${i}`] || '';
        if (k) envKeys.push({ chat: k, summary: k, index: i, fails: 0, active: true });
    }
    // Eski VITE_GROQ_API_KEY ham ishlayveradi (fallback)
    if (!envKeys.length) {
        const single = env.VITE_GROQ_API_KEY || '';
        if (single) envKeys.push({ chat: single, summary: single, index: 1, fails: 0, active: true });
    }

    if (envKeys.length) {
        apiKeys = envKeys;
        console.log(`✅ ${apiKeys.length} API key ENV dan yuklandi`);
        return;
    }

    if (!currentUser || currentUser._isLocalOnly) return;

    try {
        const snap = await getDoc(doc(db, 'configs', 'api_keys'));
        if (snap.exists()) {
            const data   = snap.data();
            const total  = data.total_pairs || 0;
            apiKeys = [];
            for (let i = 1; i <= total; i++) {
                const c = data[`gk_chat_${i}`];
                const s = data[`gk_sum_${i}`];
                if (c && s) apiKeys.push({ chat: c, summary: s, index: i, fails: 0, active: true });
            }
            console.log(`✅ ${apiKeys.length} API key Firestore dan yuklandi`);
        }
    } catch (e) {
        console.error('API keys:', e.message);
    }
}

function getKey() {
    const active = apiKeys.filter(k => k.active);
    if (!active.length) {
        apiKeys.forEach(k => { k.active = true; k.fails = 0; });
        return apiKeys[0] || null;
    }
    const k = active[keyIndex % active.length];
    keyIndex = (keyIndex + 1) % active.length;
    return k;
}

function markFail(k) {
    if (!k) return;
    k.fails++;
    if (k.fails >= 3) {
        k.active = false;
        setTimeout(() => { k.active = true; k.fails = 0; }, 5 * 60000);
    }
}

// ==================== WELCOME SCREEN ====================
function showWelcome() {
    const win = document.getElementById('chat-window');
    win.innerHTML = '';
    const name = currentUser?.displayName?.split(' ')[0] || 'do\'stim';
    const div  = document.createElement('div');
    div.id = 'welcome-screen';
    div.innerHTML = `
        <div class="welcome-logo"><span class="mr">MR</span><span class="ai">AI</span></div>
        <div class="welcome-user"><i class="fas fa-user-circle"></i> Salom, ${name}!</div>
        <p class="welcome-sub">Cheksiz xotiraga ega MR AI — sizning aqlli hamkoringiz.</p>
        <div class="welcome-chips">
            <div class="chip" onclick="quickPrompt(this)">💡 Kodni tushuntir</div>
            <div class="chip" onclick="quickPrompt(this)">✍️ Matn yoz</div>
            <div class="chip" onclick="quickPrompt(this)">🧮 Masala yech</div>
            <div class="chip" onclick="quickPrompt(this)">🌐 Tarjima qil</div>
        </div>
    `;
    win.appendChild(div);
    currentChatId = null;
    chatHistory   = [];
    memCache      = { ctx: '', ts: 0 };
    updateHeaderTitle('');
}

window.quickPrompt = function(el) {
    const txt = el.textContent.replace(/^[\u{1F100}-\u{1FFFF}\s]+/u, '').trim();
    document.getElementById('user-input').value = txt;
    document.getElementById('user-input').focus();
};

// ==================== HISTORY ====================
function loadHistory() {
    if (!currentUser || currentUser._isLocalOnly) return;

    const q = query(
        collection(db, 'users', currentUser.uid, 'chats'),
        orderBy('time', 'desc')
    );

    onSnapshot(q, snap => {
        const box = document.getElementById('history-box');
        if (snap.empty) {
            box.innerHTML = `<div class="history-empty"><i class="fas fa-comment-dots" style="font-size:24px;margin-bottom:8px;display:block;opacity:0.4"></i>Hali suhbat yo'q</div>`;
            return;
        }
        box.innerHTML = '';
        snap.forEach(d => {
            const data  = d.data();
            const item  = document.createElement('div');
            item.className = `history-item${currentChatId === d.id ? ' active-chat' : ''}`;
            item.innerHTML = `
                <span onclick="switchChat('${d.id}')">${data.title || 'Yangi suhbat'}</span>
                <button class="del-btn" onclick="deleteChat('${d.id}', event)" title="O'chirish">
                    <i class="fas fa-trash-alt"></i>
                </button>
            `;
            box.appendChild(item);
        });
    });
}

window.switchChat = async function(id) {
    if (!id || !currentUser) return;
    currentChatId = id;
    chatHistory   = [];
    memCache      = { ctx: '', ts: 0 };
    closeSidebar();

    const chatRef = doc(db, 'users', currentUser.uid, 'chats', id);
    const chatDoc = await getDoc(chatRef);
    const title   = chatDoc.exists() ? chatDoc.data().title || 'Suhbat' : 'Suhbat';
    updateHeaderTitle(title);

    const win = document.getElementById('chat-window');
    win.innerHTML = '<div style="text-align:center;color:var(--text-sec);padding:60px;font-size:14px;">Yuklanmoqda...</div>';

    try {
        const msgQ  = query(collection(chatRef, 'messages'), orderBy('time', 'asc'));
        const msgs  = await getDocs(msgQ);
        win.innerHTML = '';
        msgs.forEach(m => {
            const data = m.data();
            renderMsg(data.text, data.role, true);
            chatHistory.push({
                role:    data.role === 'ai' ? 'assistant' : 'user',
                content: data.text
            });
        });
        win.scrollTop = win.scrollHeight;
    } catch (e) {
        win.innerHTML = '<div style="text-align:center;color:var(--danger);padding:40px;">Xatolik yuz berdi!</div>';
    }
};

window.deleteChat = async function(id, event) {
    event.stopPropagation();
    if (!confirm("Bu suhbatni o'chirmoqchimisiz?")) return;
    await deleteDoc(doc(db, 'users', currentUser.uid, 'chats', id));
    if (currentChatId === id) showWelcome();
};

// ==================== MESSAGE RENDER ====================
function renderMsg(text, role, isHistory = false) {
    const win = document.getElementById('chat-window');

    // Welcome screen ni yashir
    const ws = document.getElementById('welcome-screen');
    if (ws) { ws.classList.add('fade-out'); setTimeout(() => ws.remove(), 400); }

    const div = document.createElement('div');
    div.className = `msg-container msg-${role}`;

    if (role === 'user') {
        div.innerHTML = `<div class="bubble">${escapeHtml(text)}</div>`;
    } else {
        div.innerHTML = `
            <div class="bubble">
                <div class="ai-text"></div>
                <div class="actions-footer">
                    <button class="action-btn" onclick="copyAiText(this)" title="Nusxa olish"><i class="far fa-copy"></i></button>
                    <button class="action-btn" onclick="speakText(this)"  title="Ovozli o'qish"><i class="fas fa-volume-up"></i></button>
                </div>
            </div>
        `;
    }

    win.appendChild(div);

    if (role === 'ai') {
        const el = div.querySelector('.ai-text');
        if (isHistory) {
            el.innerHTML = marked.parse(text);
            applyCodeButtons();
            typeset(el);
        } else {
            animateText(el, text, win);
        }
    }

    if (role === 'user') win.scrollTop = win.scrollHeight;
    return div;
}

function animateText(el, text, win) {
    let i = 0;
    const tick = () => {
        if (abortController?.signal.aborted) {
            el.innerHTML = marked.parse(text);
            applyCodeButtons();
            typeset(el);
            resetSendBtn();
            return;
        }
        if (i <= text.length) {
            el.innerHTML = marked.parse(text.substring(0, i));
            i++;
            const bottom = win.scrollHeight - win.scrollTop <= win.clientHeight + 220;
            if (bottom) win.scrollTop = win.scrollHeight;
            setTimeout(tick, 5);
        } else {
            applyCodeButtons();
            typeset(el);
            resetSendBtn();
        }
    };
    tick();
}

function typeset(el) {
    if (window.MathJax) MathJax.typesetPromise([el]).catch(() => {});
}

function applyCodeButtons() {
    document.querySelectorAll('.ai-text pre').forEach(pre => {
        if (pre.querySelector('.copy-code-btn')) return;
        const btn = document.createElement('button');
        btn.className  = 'copy-code-btn';
        btn.textContent = 'COPY';
        btn.onclick = () => {
            const code = pre.querySelector('code')?.innerText || '';
            navigator.clipboard.writeText(code).then(() => {
                btn.textContent = 'COPIED!';
                btn.classList.add('copied');
                setTimeout(() => { btn.textContent = 'COPY'; btn.classList.remove('copied'); }, 2000);
            });
        };
        pre.appendChild(btn);
        if (window.Prism) Prism.highlightElement(pre.querySelector('code'));
    });
}

function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==================== TYPING INDICATOR ====================
function showTyping() {
    const win = document.getElementById('chat-window');
    const d   = document.createElement('div');
    d.id = 'typing-ind';
    d.className = 'msg-container msg-ai';
    d.innerHTML = `<div class="bubble"><div class="typing-dots"><span></span><span></span><span></span></div></div>`;
    win.appendChild(d);
    win.scrollTop = win.scrollHeight;
}

function removeTyping() {
    document.getElementById('typing-ind')?.remove();
}

// ==================== SEND MESSAGE ====================
window.sendMessage = async function() {
    const input   = document.getElementById('user-input');
    const message = input.value.trim();
    if (!message) return;

    renderMsg(message, 'user');
    input.value = '';
    input.style.height = '';

    const btn = document.getElementById('send-btn');
    btn.dataset.status = 'streaming';

    if (abortController) abortController.abort();
    abortController = new AbortController();

    showTyping();

    const maxTries = Math.max((apiKeys.length || 1) * 2, 4);
    let tries = 0;

    while (tries < maxTries) {
        try {
            const kp  = getKey();
            if (!kp) throw new Error('API key topilmadi');

            const sysPrompt = await buildSystemPrompt(message);
            const msgs = [
                { role: 'system', content: sysPrompt },
                ...chatHistory.slice(-10),
                { role: 'user', content: message }
            ];

            const resp = await fetch(PROVIDERS.chat.url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${kp.chat}`,
                    'Content-Type':  'application/json'
                },
                body: JSON.stringify({
                    model:       MODES[currentMode].max_tokens < 1000 ? PROVIDERS.chat.model : PROVIDERS.chat.model,
                    messages:    msgs,
                    temperature: MODES[currentMode].temperature,
                    max_tokens:  MODES[currentMode].max_tokens
                }),
                signal: abortController.signal
            });

            if (!resp.ok) {
                const err = await resp.json().catch(() => ({}));
                throw new Error(err.error?.message || `HTTP ${resp.status}`);
            }

            const data  = await resp.json();
            const aiText = data.choices?.[0]?.message?.content || 'AI javob bermadi...';

            removeTyping();
            renderMsg(aiText, 'ai');

            chatHistory.push({ role: 'user',      content: message });
            chatHistory.push({ role: 'assistant', content: aiText  });

            kp.fails = 0;

            // Firestore ga saqlash
            await saveToFirestore(message, aiText, kp);

            resetSendBtn();
            return;

        } catch (err) {
            if (err.name === 'AbortError') {
                removeTyping();
                resetSendBtn();
                return;
            }
            console.error(`❌ Urinish ${tries+1}:`, err.message);
            markFail(getKey());
            tries++;

            if (tries >= maxTries) {
                removeTyping();
                renderMsg(err.message.includes('429') || err.message.includes('rate')
                    ? '⚡ Ko\'p so\'rov yuborildi. Biroz kuting.'
                    : '❌ Texnik nosozlik. Iltimos, keyinroq urinib ko\'ring.', 'ai');
                resetSendBtn();
                return;
            }
            await new Promise(r => setTimeout(r, 400 * tries));
        }
    }
    resetSendBtn();
};

// ==================== FIRESTORE SAVE ====================
async function saveToFirestore(userMsg, aiMsg, kp) {
    if (!currentUser || currentUser._isLocalOnly) return;
    try {
        const uid = currentUser.uid;

        if (!currentChatId) {
            const title = userMsg.length > 32 ? userMsg.substring(0, 32) + '...' : userMsg;
            const chatDoc = await addDoc(collection(db, 'users', uid, 'chats'), {
                title: title,
                time:  serverTimestamp()
            });
            currentChatId = chatDoc.id;
            updateHeaderTitle(title);
        }

        const msgCol = collection(db, 'users', uid, 'chats', currentChatId, 'messages');
        await addDoc(msgCol, { role: 'user', text: userMsg, time: serverTimestamp() });
        await addDoc(msgCol, { role: 'ai',   text: aiMsg,  time: serverTimestamp() });

        // Xotira bloki (background)
        createMemoryBlock(userMsg, aiMsg, kp?.summary).catch(() => {});

        // Har 8 xabarda sarlavha yangilash
        if (chatHistory.length % 8 === 0) autoRenameChat(kp?.chat).catch(() => {});

    } catch (e) {
        console.error('saveToFirestore:', e.message);
    }
}

// ==================== SISTEM PROMPT ====================
function getBasePrompt() {
    const name = currentUser?.displayName?.split(' ')[0] || 'do\'stim';
    const now  = new Date();
    const date = now.toLocaleDateString('uz-UZ');
    const time = now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });

    return `Siz MR AI, Muhammadrasul tomonidan yaratilgan CHEKSIZ XOTIRAGA ega aqlli yordamchisiz.
Hozirgi foydalanuvchi: ${name}. Sana: ${date}. Vaqt: ${time}.
Siz Meta, Google, OpenAI yoki boshqa kompaniyalarga tegishli emassiz — siz MRDev mahsulotisiz.

QOIDALAR:
1. Matematik formulalar uchun LaTeX ($...$ yoki $$...$$) ishlatgin.
2. Javoblarni Markdown formatida chiroyli qil (jadval, ro'yxat, kod bloklari).
3. Suhbat qaysi tilda bo'lsa, o'sha tilda javob ber.
4. Do'stona, samimiy, aniq bo'l.

${MODES[currentMode].prompt}`;
}

async function buildSystemPrompt(message) {
    const base   = getBasePrompt();
    const memCtx = await buildMemoryContext(message);
    return memCtx
        ? `${base}\n\n【OLDINGI XOTIRALAR】\n${memCtx}\n\nJavobingizni boshlang:`
        : `${base}\n\nJavobingizni boshlang:`;
}

// ==================== MEMORY SYSTEM ====================
async function buildMemoryContext(message) {
    if (!currentUser || currentUser._isLocalOnly) return '';
    if (memCache.ctx && (Date.now() - memCache.ts) < 25000) return memCache.ctx;

    try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const global  = userDoc.data()?.globalSummary || '';
        if (!global) return '';

        const ctx = `Foydalanuvchi haqida umumiy ma'lumot:\n${global}`;
        memCache   = { ctx, ts: Date.now() };
        return ctx;
    } catch { return ''; }
}

async function createMemoryBlock(userMsg, aiMsg, summaryKey) {
    if (!currentUser || currentUser._isLocalOnly || !summaryKey) return;
    try {
        const prompt = `Qisqa xulosa yasang (JSON):\n{"summary":"1 gap","topic":"mavzu","importance":0.0-1.0}\n\nFoydalanuvchi: ${userMsg.substring(0, 300)}\nAI: ${aiMsg.substring(0, 300)}`;
        const resp   = await fetch(PROVIDERS.summary.url, {
            method:  'POST',
            headers: { 'Authorization': `Bearer ${summaryKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: PROVIDERS.summary.model,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3,
                max_tokens: 120,
                response_format: { type: 'json_object' }
            })
        });
        const data   = await resp.json();
        const result = JSON.parse(data.choices?.[0]?.message?.content || '{}');

        if ((result.importance || 0) < MEM.MIN_IMPORTANCE) return;

        await addDoc(collection(db, 'users', currentUser.uid, 'summaries'), {
            level:     0,
            content:   result.summary || 'Suhbat xulosasi',
            importance: result.importance || 0.6,
            metadata:  { topic: result.topic || 'general', chatId: currentChatId },
            timestamp: serverTimestamp()
        });

        // Global summary yangilash
        const ref     = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(ref);
        const current = userSnap.data()?.globalSummary || '';
        const updated = current
            ? `${current}\n• ${result.summary} [${result.topic || 'general'}]`
            : `• ${result.summary} [${result.topic || 'general'}]`;

        await setDoc(ref, {
            globalSummary: updated.length > MEM.MAX_CONTEXT_LEN
                ? updated.slice(-MEM.MAX_CONTEXT_LEN)
                : updated,
            lastUpdated: serverTimestamp()
        }, { merge: true });

        memCache = { ctx: '', ts: 0 }; // Cache ni yangilash uchun reset

    } catch (e) {
        console.error('createMemoryBlock:', e.message);
    }
}

// ==================== AUTO RENAME ====================
async function autoRenameChat(apiKey) {
    if (!currentChatId || !apiKey || chatHistory.length < 4) return;
    try {
        const ctx  = chatHistory.slice(-4).map(m => m.content).join(' ').substring(0, 400);
        const resp = await fetch(PROVIDERS.chat.url, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: PROVIDERS.chat.model,
                messages: [
                    { role: 'system', content: 'Suhbatga 2-3 so\'zli qisqa sarlavha ber. Faqat sarlavhani yoz.' },
                    { role: 'user',   content: ctx }
                ],
                temperature: 0.3,
                max_tokens:  20
            })
        });
        const data  = await resp.json();
        let title   = (data.choices?.[0]?.message?.content || '').replace(/["'.*]/g, '').trim();
        if (!title) return;
        if (title.length > 34) title = title.substring(0, 34) + '...';

        await setDoc(doc(db, 'users', currentUser.uid, 'chats', currentChatId), { title }, { merge: true });
        updateHeaderTitle(title);
    } catch { /* silent */ }
}

// ==================== UI HELPERS ====================
function updateHeaderTitle(title) {
    const el = document.getElementById('chat-title');
    if (el) el.textContent = title;
}

function resetSendBtn() {
    const btn = document.getElementById('send-btn');
    if (btn) btn.dataset.status = 'idle';
    abortController = null;
}

window.toggleSidebar = function() {
    document.body.classList.toggle('sidebar-open');
};

function closeSidebar() {
    document.body.classList.remove('sidebar-open');
}

window.createNewChat = function() {
    closeSidebar();
    showWelcome();
};

window.handleEnter = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
};

// ==================== MODE SELECTOR ====================
window.toggleModeMenu = function() {
    document.getElementById('mode-menu').classList.toggle('show');
};

window.setMode = function(mode) {
    currentMode = mode;
    document.getElementById('mode-icon').className = `fas ${MODES[mode].icon}`;
    document.querySelectorAll('.mode-opt').forEach((el, i) => {
        el.classList.toggle('active', Object.keys(MODES)[i] === mode);
    });
    document.getElementById('mode-menu').classList.remove('show');
};

// Close mode menu on outside click
document.addEventListener('click', e => {
    if (!e.target.closest('.mode-wrap')) {
        document.getElementById('mode-menu')?.classList.remove('show');
    }
});

// ==================== COPY AI TEXT ====================
window.copyAiText = function(btn) {
    const el = btn.closest('.bubble')?.querySelector('.ai-text');
    if (!el) return;
    const clone = el.cloneNode(true);
    clone.querySelectorAll('button').forEach(b => b.remove());
    navigator.clipboard.writeText(clone.innerText.trim()).then(() => {
        const icon = btn.querySelector('i');
        icon.className = 'fas fa-check';
        setTimeout(() => { icon.className = 'far fa-copy'; }, 2000);
    });
};

// ==================== TTS / AUDIO PLAYER ====================
window.speakText = function(btn) {
    const el = btn.closest('.bubble')?.querySelector('.ai-text');
    if (!el) return;
    const text = el.innerText.trim();

    if (currentTTSText === text && isAudioPaused) {
        window.speechSynthesis.resume();
        togglePauseUI(false);
        return;
    }
    if (btn.classList.contains('speaking') && !isAudioPaused) {
        window.speechSynthesis.pause();
        togglePauseUI(true);
        return;
    }

    stopAudio();
    currentTTSText = text;
    currentTTSBtn  = btn;

    document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('speaking'));
    btn.classList.add('speaking');

    const player = document.getElementById('audio-player');
    const fill   = document.getElementById('progress-fill');
    player.classList.add('show');
    fill.style.width = '0%';
    togglePauseUI(false);

    currentUtterance = new SpeechSynthesisUtterance(text);
    currentUtterance.lang  = /[a-zA-Z]{3,}/.test(text) ? 'en-US' : 'uz-UZ';
    currentUtterance.rate  = 1.0;

    const words    = text.split(/\s+/).length;
    const duration = (words / 150) * 60000;
    const start    = Date.now();

    audioInterval = setInterval(() => {
        if (!isAudioPaused) {
            const pct = Math.min(((Date.now() - start) / duration) * 100, 100);
            fill.style.width = pct + '%';
            if (pct >= 100) { clearInterval(audioInterval); setTimeout(closeAudio, 300); }
        }
    }, 100);

    currentUtterance.onend  = closeAudio;
    currentUtterance.onerror = closeAudio;
    window.speechSynthesis.speak(currentUtterance);
};

window.toggleAudio = function() {
    if (!currentUtterance) return;
    if (isAudioPaused) { window.speechSynthesis.resume(); togglePauseUI(false); }
    else               { window.speechSynthesis.pause();  togglePauseUI(true);  }
};

window.closeAudioPlayer = closeAudio;

function closeAudio() {
    window.speechSynthesis.cancel();
    clearInterval(audioInterval);
    document.getElementById('audio-player')?.classList.remove('show');
    document.querySelectorAll('.action-btn').forEach(b => b.classList.remove('speaking'));
    document.getElementById('progress-fill').style.width = '0%';
    currentUtterance = null;
    isAudioPaused    = false;
    currentTTSText   = '';
    currentTTSBtn    = null;
}

function stopAudio() {
    window.speechSynthesis.cancel();
    clearInterval(audioInterval);
    isAudioPaused = false;
}

function togglePauseUI(paused) {
    isAudioPaused = paused;
    const icon = document.querySelector('#play-pause-btn i');
    if (icon) icon.className = paused ? 'fas fa-play' : 'fas fa-pause';
}

// ==================== LOGOUT ====================
window.logout = async function() {
    try {
        await signOut(auth);
    } catch { /* ok */ }
    localStorage.removeItem('mrdev_local_auth');
    localStorage.removeItem('mrdev_user_id');
    localStorage.removeItem('mrdev_auth_user');
    window.location.href = '../../';
};

// ==================== TEXTAREA AUTO-RESIZE ====================
document.getElementById('user-input')?.addEventListener('input', function() {
    this.style.height = '';
    this.style.height = Math.min(this.scrollHeight, 140) + 'px';
});

// ==================== SIDEBAR OVERLAY CLICK ====================
document.getElementById('sidebar-overlay')?.addEventListener('click', closeSidebar);

console.log('🚀 MR AI v3.0 — MRDEV integratsiya yuklandi!');