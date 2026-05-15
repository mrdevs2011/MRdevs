# 🔥 MRDEV — Multi-App Platform

**22+ ilova, bitta platforma.** Firebase + Vite asosida qurilgan.

---

## 🚀 Ishga tushirish

### 1. O'rnatish
```bash
git clone https://github.com/your-repo/mrdev.git
cd mrdev
npm install
```

### 2. Environment variables
`.env.local` faylini yarating (`.env.example` dan nusxa oling):
```bash
cp .env.example .env.local
```
Keyin Firebase konsolidan kalitlarni kiriting:
```env
VITE_MAIN_API_KEY=...
VITE_MAIN_AUTH_DOMAIN=...
VITE_MAIN_DATABASE_URL=...
VITE_MAIN_PROJECT_ID=...
VITE_MAIN_STORAGE_BUCKET=...
VITE_MAIN_MESSAGING_SENDER_ID=...
VITE_MAIN_APP_ID=...
```

### 3. Dev server
```bash
npm run dev        # localhost:3000
npm run build      # dist/ papkasiga production build
npm run preview    # build ni local test qilish
npm run test       # testlarni ishga tushirish
```

---

## 📁 Loyiha tuzilishi

```
MRDEV/
├── assets/
│   ├── css/              # Global CSS (header, modal, auth, ...)
│   ├── js/
│   │   ├── core/         # Auth, Firebase init, i18n, theme, logger, app-shell
│   │   ├── ui/           # Sidebar, tabs, search, modal, user-menu
│   │   ├── features/     # Google auth, email auth, MRDEV ID, pass-notifications
│   │   └── *.js          # firebase-helper, dropdown, app, config
│   └── locales/          # Tarjima fayllari (uz.json, ru.json, en.json)
│       ├── uz.json
│       ├── ru.json
│       └── en.json
├── popular/              # Asosiy ilovalar (notes, todo, ai, mrgram, ...)
├── mini/                 # Yordamchi ilovalar (calculator, timer, clock, ...)
├── settings/             # Sozlamalar sahifasi
├── about/                # Loyiha haqida
├── tests/                # Vitest testlari
├── vite.config.js        # Vite sozlamasi (multi-page)
├── firestore.rules       # Firestore xavfsizlik qoidalari
├── realtime-database.rules.json  # Realtime DB qoidalari
├── MIGRATION.md          # Compat → Modular SDK ko'rsatma
└── .env.local            # (gitignore) Local kalitlar
```

---

## 🏗️ Arxitektura

### Firebase
Uch alohida Firebase project:
- **main** — Barcha ilovalar ma'lumotlari (Firestore + RTDB)
- **secondary** — Qo'shimcha ma'lumotlar
- **groupboard** — Group Board ilovasi uchun alohida DB

### Auth
Uch xil kirish usuli:
- Google OAuth
- Email/Parol (maxsus `@mrdev.uz` domenida)
- MRDEV ID (6 xonali shaxsiy kod)

### i18n
Uch til: O'zbek (`uz`), Rus (`ru`), Ingliz (`en`).
Tarjimalar `assets/locales/*.json` fayllarida, dinamik `import()` orqali yuklanadi.

### App Shell
Yangi ilovalar `app-shell.js` ishlatsin:
```javascript
import { initAppShell } from '../../assets/js/core/app-shell.js';
await initAppShell({ requireAuth: true, onAuth: (user) => { ... } });
```

### EventBus
`window.xxx` o'rniga `data-action` atributi va `EventBus`:
```html
<button data-action="logout">Chiqish</button>
<button data-action="toggle-theme">Tema</button>
```

---

## 🧪 Testlar

```bash
npm run test             # bir marta ishga tushir
npm run test:watch       # watch mode
npm run test:coverage    # coverage hisoboti
```

Test fayllari `tests/` papkasida.

---

## 🔒 Firebase Security Rules

### Firestore → `firestore.rules`
- Har bir foydalanuvchi faqat o'z `$uid` tagidagi ma'lumotlarini o'qiy/yoza/o'chira oladi
- `typing_leaderboard` ommaviy o'qiladi
- `system` (NotifyHub) faqat Admin SDK yoza oladi
- `group_boards` — faqat egasi o'zgartira/o'chira oladi

### Realtime Database → `realtime-database.rules.json`
Xuddi shu tamoyil: `$uid` bo'yicha ajratilgan

---

## 📦 Firebase qoidalarini yuklash

### Firestore
```
Firebase Console → Firestore Database → Rules → firestore.rules ni joylashtir
```

### Realtime Database
```
Firebase Console → Realtime Database → Rules → realtime-database.rules.json ni joylashtir
```

---

## ⚠️ Migratsiyon kerak bo'lgan ilovalar

Quyidagi ilovalar hali eski Firebase compat SDK ishlatmoqda. `MIGRATION.md` ga qarang:
- `popular/ai` — v9 compat
- `popular/notifyhub` — v9 compat
- `popular/security` — v9 compat
- `popular/groupboard` — v8

---

## 📱 Ilovalar ro'yxati

### Asosiy (popular/)
| Ilova | Tavsif |
|-------|--------|
| Notes | Eslatmalar |
| Todo | Vazifalar ro'yxati |
| AI | Yapay intellekt suhbat |
| MR Gram | Messenjer |
| MR Vault | Fayl saqlash |
| Board | Interaktiv doskha |
| Group Board | Jamoaviy doskha |
| Code Studio | Kod yozish muhiti |
| Learn Code | Dasturlash o'rganish |
| Examer | Test o'tkazish |
| NotifyHub | Bildirishnomalar (admin) |
| Weather | Ob-havo |
| Security | Xavfsizlik |
| Typing Test | Terish tezligi |
| Video Hub | Video kutubxona |

### Yordamchi (mini/)
Calculator · Clock · Timer · Stopwatch · QR Generator · Split View · Music · Bingo

---

*MRDEV © 2025 — v8.0*
