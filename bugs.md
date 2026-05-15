# MRDEV — Bug Ssenariylar (6 ta Tema)
**Qoida:** Har bir promptda faqat 1 ta tema. Fayllarni zip bilan yubor. Qisqa, aniq buyruq ber.

---

## 🔴 TEMA 1: Firebase Config bo'sh — hech narsa ishlamaydi
**Muammo:** `config.js` da barcha maydonlar bo'sh `""`. `firebase-helper.js` da `const ENV = {}` — ya'ni `import.meta.env` hisobga olinmagan. Natijada Firebase ulanmaydi.

**Qaysi fayllar:** `assets/js/config.js`, `assets/js/firebase-helper.js`

**Prompt matni:**
```
config.js da barcha Firebase maydonlari bo'sh string "". 
firebase-helper.js da ENV = {} shimmed, import.meta.env ishlatilmayapti.
Ikki faylni to'g'irla:
- config.js → import.meta.env.VITE_* dan o'qisin
- firebase-helper.js → ENV shimini olib tashla, to'g'ridan-to'g'ri import.meta.env ishlatsin
Faqat shu 2 fayl, boshqa hech narsa o'zgartirma.
```

---

## 🔴 TEMA 2: Auth session muddati mos emas (3 joyda 3 xil)
**Muammo:**
- `auth.js` → `getLocalAuth()`: **24 soat** dan keyin o'chiradi
- `firebase-helper.js` → `getLocalAuthUser()`: **7 kun** dan keyin o'chiradi
- `auth-helper.js` → `getCurrentUser()`: **7 kun** dan keyin o'chiradi

Foydalanuvchi 24 soatdan keyin `auth.js` da chiqib ketadi, lekin `firebase-helper.js` esa hali ham valid deb o'qiydi. Natija: auth holati aralashib ketadi, ba'zi joylarda kirgan, ba'zi joylarda chiqib ketgan ko'rinadi.

**Qaysi fayllar:** `assets/js/core/auth.js`, `assets/js/firebase-helper.js`, `assets/js/core/auth-helper.js`

**Prompt matni:**
```
3 faylda mrdev_local_auth session muddati har xil:
- auth.js: 24 soat
- firebase-helper.js: 7 kun  
- auth-helper.js: 7 kun

Hammasini 7 kun qilib birxillashtir (getLocalAuth va getLocalAuthUser va getCurrentUser).
Faqat session expiry logikasini o'zgartir, boshqa hech narsa tegma.
```

---

## 🟠 TEMA 3: Logout to'liq tozalamaydi (2 ta logoutUser, 2 ta xil xatti-harakat)
**Muammo:**
- `global-settings.js` → `logoutUser()`: faqat `mrdev_local_auth`, `mrdev_auth_user` o'chiradi. `mrdev_user_id`, `mrdev_accounts`, `mrdev_active_account`, `mrdev_last_sync` qoladi.
- `firebase-helper.js` → `logoutUser()`: `mrdev_local_auth`, `mrdev_user_id`, `mrdev_auth_user` o'chiradi. `mrdev_accounts`, `mrdev_active_account`, `mrdev_last_sync` qoladi.

Natija: logout qilgandan keyin eski account ma'lumotlari qoladi, keyingi kirishda aralashadi.

**Qaysi fayllar:** `assets/js/core/global-settings.js`, `assets/js/firebase-helper.js`

**Prompt matni:**
```
Logout to'liq ishlamaydi. 2 ta logoutUser bor, ikkalasi ham turli localStorage keylarini o'chiradi.

Ochirilishi kerak bo'lgan to'liq ro'yxat:
mrdev_local_auth, mrdev_auth_user, mrdev_user_id, mrdev_accounts, 
mrdev_active_account, mrdev_last_sync, mrdev_debug

global-settings.js va firebase-helper.js dagi logoutUser funksiyalarini 
shu to'liq ro'yxat bilan yangilat. Boshqa hech narsa o'zgartirma.
```

---

## 🟠 TEMA 4: `smartLoad` real-time yangilanishlarni o'tkazib yuboradi
**Muammo:** `firebase-helper.js` → `smartLoad()` ichida `let resolved = false` va birinchi snapshot kelgandan keyin `resolved = true` qilinadi. Keyin `if (resolved) return;` bilan barcha keyingi Firestore yangilanishlari e'tiborga olinmaydi. Demak `onSnapshot` real-time bo'lmay qoladi — faqat bir marta ishlaydi.

**Qaysi fayllar:** `assets/js/firebase-helper.js`

**Prompt matni:**
```
firebase-helper.js dagi smartLoad funksiyasida bug bor:
"let resolved = false" va onSnapshot callback ichida "if (resolved) return" 
deyilgani uchun birinchi snapshot dan keyin real-time yangilanishlar ishlamaydi.

Tuzatish: resolved flag ni olib tashla. onSnapshot har safar yangi ma'lumot 
kelganda callback chaqirsin. Local data avval ko'rsatilsin (bu qolsin), 
lekin cloud snapshot kelgan har safar ham callback ishlash kerak.
Faqat smartLoad funksiyasini o'zgartir.
```

---

## 🟡 TEMA 5: OTP Watcher — barcha foydalanuvchilar ma'lumotini o'qiydi (xavfsizlik)
**Muammo:** `assets/js/core/otp-watcher.js` → `onValue(ref(rtdb, 'pass_notifications'), ...)` — butun `pass_notifications` nodeni o'qiydi. Ya'ni har bir kirgan foydalanuvchi BARCHA foydalanuvchilarning OTP kodlarini o'qiy oladi. Keyin filtr qilinadi (matchesUid/matchesEmail), lekin ma'lumot allaqachon client ga kelgan.

**Qaysi fayllar:** `assets/js/core/otp-watcher.js`, `realtime-database.rules.json`

**Prompt matni:**
```
otp-watcher.js da xavfsizlik muammosi bor:
onValue(ref(rtdb, 'pass_notifications')) — butun nodeni o'qiydi,
barcha userlarning OTP ma'lumotlari har bir foydalanuvchiga yuklanadi.

Tuzatish:
1. otp-watcher.js: pass_notifications ichida faqat joriy user UID ga tegishli
   yo'ldan o'qisin: ref(rtdb, 'pass_notifications/' + uid) yoki 
   har bir child va email/uid match uchun query ishlat
2. realtime-database.rules.json: pass_notifications uchun faqat o'z uid bo'yicha 
   read ruxsati qolsin

Faqat shu 2 fayl.
```

---

## 🟡 TEMA 6: O'lik kod va import xatolari
**Muammo (3 ta kichik bug):**

**6a.** `auth-helper.js` → `addMrdevIdToCenter(email, mrdevId)` stub (hech narsa qilmaydi), lekin `mrdev-login.js` hali ham import qiladi va chaqiradi. Befoyda import.

**6b.** `assets/js/core/auth.js` → `import { doc } from 'firebase/firestore'` — `doc` import qilingan lekin faylda hech qayerda ishlatilmaydi.

**6c.** `multi-account.js` → `removeAccount` faqat localStorage ni tozalaydi, Firebase Auth `signOut()` chaqirmaydi. Foydalanuvchi accountni "o'chirganda" Firebase session qoladi.

**Qaysi fayllar:** `assets/js/core/auth-helper.js`, `assets/js/features/mrdev-login.js`, `assets/js/core/auth.js`, `assets/js/core/multi-account.js`

**Prompt matni:**
```
Quyidagi 3 ta kichik bug ni to'g'irla:

1. auth-helper.js: addMrdevIdToCenter stub funksiyasi bor (hech narsa qilmaydi).
   mrdev-login.js dan bu funksiya importini va chaqiruvini o'chir.
   auth-helper.js dan ham export ni o'chir.

2. auth.js: import { doc } from 'firebase/firestore' — doc ishlatilmaydi.
   Bu importni olib tashla.

3. multi-account.js: removeAccount funksiyasi faqat localStorage ni tozalaydi.
   Agar o'chirilayotgan account active account bo'lsa, Firebase auth.signOut() 
   ham chaqirilsin. auth va signOut ni import qil.

Faqat shu 4 fayl, minimal o'zgarishlar.
```

---

## 📋 Ishlatish tartibi (qaysi birinchi?)
```
TEMA 1 → TEMA 2 → TEMA 3 → TEMA 4 → TEMA 5 → TEMA 6
```
1 — eng muhim (hech narsa ishlamaydi → avval shu)
2,3 — auth/session muammolari
4,5 — funksionallik/xavfsizlik
6 — cleanup

---

## ⚡ Token tejash qoidalari
- Har promptda faqat yuqoridagi matni yoz + tegishli fayllarni zip qilib yubor
- "ssenariy 1 ni bajar" dema — to'liq tavsifni ko'chir-yopish tarzida yubor
- Biror tema tugagach, faqat o'zgartirilgan fayllarni saqla, keyingi tema uchun yangi chat ochma
