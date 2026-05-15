# MRDEV — Eski Firebase Compat SDK dan Modular SDK ga o'tish

Quyidagi ilovalar hali Firebase v8/v9 compat SDK ishlatmoqda va modular SDK ga o'tkazilishi kerak.

## Nima uchun kerak?
- **Tree-shaking**: Compat SDK butun Firebase bibliotekasini yuklab oladi (~200KB+). Modular SDK faqat kerakli funksiyalarni bundle qiladi.
- **Kelajak**: Firebase v8 compat EOL (End of Life) rejimida.

## Qaysi ilovalar migratsiyon talab qiladi?

| Ilova | Fayl | Eski versiya |
|-------|------|---|
| AI | `popular/ai/index.html` + `script.js` | v9 compat |
| NotifyHub | `popular/notifyhub/index.html` + `script.js` | v9 compat |
| Security | `popular/security/index.html` + `script.js` | v9 compat |
| GroupBoard | `popular/groupboard/*.html` + `*.js` | v8 |

## Qanday migrate qilish

### Compat (eski):
```javascript
// v9 compat
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const db = firebase.firestore();
db.collection('users').doc(uid).set(data);
```

### Modular (yangi):
```javascript
// v10 modular
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const db = getFirestore();
await setDoc(doc(db, 'users', uid), data);
```

### Asosiy farqlar:

| Compat | Modular |
|--------|---------|
| `firebase.firestore()` | `getFirestore(app)` |
| `db.collection('x').doc('y')` | `doc(db, 'x', 'y')` |
| `db.collection('x').add(data)` | `addDoc(collection(db, 'x'), data)` |
| `firebase.auth()` | `getAuth(app)` |
| `auth.currentUser` | `getAuth().currentUser` |
| `auth.onAuthStateChanged(cb)` | `onAuthStateChanged(auth, cb)` |

## App Shell ishlatish (yangi ilovalar uchun)

Yangi mini/popular ilovalar uchun `app-shell.js` dan foydalaning:

```javascript
// Eski (har bir ilovada takrorlangan):
import { initTheme } from '../../assets/js/core/theme.js';
import { initI18n } from '../../assets/js/core/i18n.js';
import { auth } from '../../assets/js/core/firebase-init.js';
import { onAuthStateChanged } from 'firebase/auth';
// ...20+ qator init kodi...

// Yangi (app-shell bilan):
import { initAppShell, showToast, t } from '../../assets/js/core/app-shell.js';

document.addEventListener('DOMContentLoaded', async () => {
    await initAppShell({
        requireAuth: true,
        appName: 'notes',
        onAuth: (user) => {
            // Foydalanuvchi login — ilovani ishga tushir
            loadNotes(user.uid);
        },
        redirectOnNoAuth: '../../index.html'
    });
});
```
