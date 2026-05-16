# 🔥 MRDEV — Firebase Security Rules (Account-Based)

## Asosiy tamoyil

**Barcha 22 ta ilova ma'lumotlari foydalanuvchi accountiga saqlanadi.**
Hech bir ilova LocalStorage'ni emas, Firebase'ni ishlatadi.

Struktura:  `collection / $uid / $itemId`

Foydalanuvchi faqat o'zining ma'lumotlarini ko'ra va yoza oladi.

---

## 📦 Firebase node'lari (kim qayerda saqlanadi)

| Ilova | Node | Mini/Popular |
|-------|------|:---:|
| MR Vault | `vault_files/$uid`, `vault_shares/$uid` | Popular |
| Examer | `exams/$uid`, `exam_results/$uid` | Popular |
| Board | `board_data/$uid`, `board_elements/$uid` | Popular |
| MR Gram | `messages/$uid`, `channels/$uid`, `posts/$uid`, `comments/$uid` | Popular |
| Notes | `notes/$uid` | Popular |
| Todo | `todos/$uid` | Popular |
| NotifyHub | `system` (admin only) | Popular |
| Weather | `weather_cache/$uid` | Popular |
| AI | `ai_conversations/$uid` | Popular |
| Code Studio | `code_projects/$uid` | Popular |
| Learn Code | `user_progress/$uid` | Popular |
| Group Board | `group_boards/$uid` | Popular |
| Security | `user_security/$uid` | Popular |
| Typing Test | `typing_results/$uid`, `typing_leaderboard` | Popular |
| Video Hub | `videos/$uid` | Popular |
| Calculator | `calc_history/$uid` | Mini |
| Clock | `clock_settings/$uid` | Mini |
| Timer | `timer_presets/$uid` | Mini |
| Stopwatch | `stopwatch_laps/$uid` | Mini |
| QR Generator | `qr_history/$uid` | Mini |
| Split View | `splitview_layouts/$uid` | Mini |
| Music | `music_playlists/$uid` | Mini |
| Bingo | `bingo_scores/$uid` | Mini |

---

## 🚀 O'rnatish

### Realtime Database
Firebase Console → Realtime Database → Rules → `realtime-database.rules.json` ni joylashtir.

### Firestore
Firebase Console → Firestore Database → Rules → `firestore.rules` ni joylashtir.

---

## 🔧 JS misoli (ilovada ishlatish)

```javascript
import { getDatabase, ref, set, get } from "firebase/database";

const db = getDatabase();
const uid = auth.currentUser.uid;

// Saqlash
await set(ref(db, `notes/${uid}/${noteId}`), {
  title: "Salom dunyo",
  content: "...",
  createdAt: Date.now()
});

// O'qish
const snap = await get(ref(db, `notes/${uid}`));
const myNotes = snap.val();
```

---

*MRDEV © 2025*
