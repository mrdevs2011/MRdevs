// ==================== MRDEV NOTIF-PASS v7.0 ====================
// i18n va global settings bilan integratsiyalashgan

import logger from './core/logger.js';
import { db, rtdb } from './core/firebase-init.js';
import {
    collection, doc, setDoc, getDoc, getDocs, updateDoc,
    query, where, orderBy, limit, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import {
    ref, push, get, set, update, remove, onValue
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js';

export function generateUserId() {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return '#' + (100000 + (arr[0] % 900000)).toString();
}

export function generatePassCode() {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return (100000 + (arr[0] % 900000)).toString();
}

export function generateSecurePassword() {
    const arr = new Uint8Array(24);
    crypto.getRandomValues(arr);
    return btoa(String.fromCharCode(...arr))
        .replace(/\+/g, 'X')
        .replace(/\//g, 'Y')
        .replace(/=/g, 'Z')
        .substring(0, 32);
}

export async function saveUserMrdevId(user, extraData = {}) {
    if (!user || !user.uid) {
        logger.core.error('saveUserMrdevId: user.uid mavjud emas');
        return null;
    }

    const uid         = user.uid;
    const email       = user.email || '';
    const displayName = user.displayName || email.split('@')[0] || 'User';
    const photoURL    = user.photoURL || null;
    const linkedTo    = extraData.linkedTo || null;

    logger.core.saveStart(uid, email, linkedTo);

    try {
        const userRef  = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const data = userSnap.data();

            if (data.mrdevId && data.mrdevId !== '') {
                logger.core.existing(data.mrdevId);
                try {
                    const updateData = {
                        displayName: displayName,
                        email:       email,
                        photoURL:    photoURL || data.photoURL || null,
                        lastLogin:   serverTimestamp(),
                        updatedAt:   serverTimestamp()
                    };
                    if (extraData.hasOwnProperty('linkedTo')) {
                        updateData.linkedTo = linkedTo;
                    }
                    await updateDoc(userRef, updateData);
                } catch (e) {
                    logger.core.updateError(e.message);
                }
                return data.mrdevId;
            }

            const mrdevId       = generateUserId();
            const mrdevPassword = generateSecurePassword();

            await updateDoc(userRef, {
                mrdevId:       mrdevId,
                mrdevPassword: mrdevPassword,
                linkedTo:      linkedTo,
                lastLogin:     serverTimestamp(),
                updatedAt:     serverTimestamp()
            });

            logger.core.newUpdate(mrdevId);
            return mrdevId;
        }

        const mrdevId       = generateUserId();
        const mrdevPassword = generateSecurePassword();

        await setDoc(userRef, {
            uid:           uid,
            email:         email,
            displayName:   displayName,
            photoURL:      photoURL,
            provider:      user.providerData?.[0]?.providerId || 'unknown',
            mrdevId:       mrdevId,
            mrdevPassword: mrdevPassword,
            linkedTo:      linkedTo,
            createdAt:     serverTimestamp(),
            updatedAt:     serverTimestamp(),
            lastLogin:     serverTimestamp(),
            isActive:      true
        });

        logger.core.newCreate(mrdevId);
        return mrdevId;

    } catch (error) {
        logger.core.error(error.message);
        return null;
    }
}

export async function loginWithMrdevId(mrdevId) {
    logger.core.loginStart(mrdevId);

    try {
        const snap = await getDocs(
            query(collection(db, 'users'), where('mrdevId', '==', mrdevId))
        );

        if (snap.empty) throw new Error('MRDEV ID topilmadi');

        const userData = snap.docs[0].data();
        const userUid  = snap.docs[0].id;

        if (!userData.email) throw new Error('Bu hisob bilan email bog\'lanmagan');

        logger.core.loginFound(userData.email, userData.linkedTo);

        return {
            uid:           userUid,
            firestoreUid:  userUid,
            email:         userData.email,
            displayName:   userData.displayName || userData.email.split('@')[0],
            photoURL:      userData.photoURL || null,
            mrdevId:       userData.mrdevId,
            mrdevPassword: userData.mrdevPassword || null,
            linkedTo:      userData.linkedTo || null
        };
    } catch (error) {
        logger.core.loginError(error.message);
        throw error;
    }
}

export async function getLinkedAccount(mrdevId) {
    if (!mrdevId) return null;
    logger.core.linkStart(mrdevId);

    try {
        const snap = await getDocs(
            query(collection(db, 'users'), where('mrdevId', '==', mrdevId))
        );

        if (snap.empty) return null;

        const userData = snap.docs[0].data();
        const userUid  = snap.docs[0].id;

        return {
            uid:         userUid,
            email:       userData.email,
            displayName: userData.displayName,
            photoURL:    userData.photoURL,
            mrdevId:     userData.mrdevId
        };
    } catch (e) {
        logger.error.firebase(e.message);
        return null;
    }
}

export async function linkAccount(uid, targetMrdevId) {
    logger.core.linkAccount(uid, targetMrdevId);

    try {
        const targetSnap = await getDocs(
            query(collection(db, 'users'), where('mrdevId', '==', targetMrdevId))
        );

        if (targetSnap.empty) {
            throw new Error('Ulanmoqchi bo\'lgan MRDEV ID topilmadi');
        }

        await updateDoc(doc(db, 'users', uid), {
            linkedTo:  targetMrdevId,
            updatedAt: serverTimestamp()
        });

        logger.core.linkSuccess(uid, targetMrdevId);
        return { success: true, linkedTo: targetMrdevId };
    } catch (error) {
        logger.core.linkError(error.message);
        throw error;
    }
}

export async function unlinkAccount(uid) {
    logger.core.unlink(uid);

    try {
        await updateDoc(doc(db, 'users', uid), {
            linkedTo:  null,
            updatedAt: serverTimestamp()
        });

        logger.core.unlinkSuccess();
        return { success: true };
    } catch (error) {
        logger.core.linkError(error.message);
        throw error;
    }
}

export async function sendPassCode(mrdevId) {
    logger.core.sendCode(mrdevId);

    try {
        const snap = await getDocs(
            query(collection(db, 'users'), where('mrdevId', '==', mrdevId))
        );

        if (snap.empty) throw new Error('ID topilmadi');

        const userData = snap.docs[0].data();
        const userUid  = snap.docs[0].id;
        const passCode = generatePassCode();
        const expiresAt = Date.now() + 120000;

        const newRef = push(ref(rtdb, 'pass_notifications'));
        await set(newRef, {
            passCode:     passCode,
            mrdevId:      mrdevId,
            uid:          userUid,
            firestoreUid: userUid,
            email:        userData.email,
            expiresAt:    expiresAt,
            used:         false,
            createdAt:    Date.now()
        });

        logger.mrdev.otpSentDev(passCode);
        logger.core.sendCodeSuccess(userData.email);
        return { success: true, email: userData.email, expiresAt: expiresAt, userId: userUid };
    } catch (error) {
        logger.core.sendCodeError(error.message);
        throw error;
    }
}

export async function verifyPassCode(mrdevId, passCode) {
    logger.core.verifyCode(mrdevId);

    try {
        const snapshot = await get(ref(rtdb, 'pass_notifications'));
        const data     = snapshot.val();
        if (!data) throw new Error('Xabarlar topilmadi');

        let foundKey = null, foundData = null;
        for (const [key, val] of Object.entries(data)) {
            if (val.passCode === passCode && val.mrdevId === mrdevId && !val.used && val.expiresAt > Date.now()) {
                foundKey = key; foundData = val; break;
            }
        }

        if (!foundData) throw new Error("Noto'g'ri parol yoki muddati tugagan");

        await update(ref(rtdb, `pass_notifications/${foundKey}`), { used: true, verifiedAt: Date.now() });

        logger.core.verifySuccess();
        return { success: true, uid: foundData.uid, email: foundData.email, mrdevId: foundData.mrdevId };
    } catch (error) {
        logger.core.verifyError(error.message);
        throw error;
    }
}

export async function getUserMrdevPassword(uid) {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? snap.data().mrdevPassword || null : null;
    } catch (e) { return null; }
}

export function loadNotifications(callback) {
    return onValue(ref(rtdb, 'pass_notifications'), (snap) => {
        const data = snap.val();
        if (!data) { callback([]); return; }
        const items = Object.entries(data).map(([key, value]) => ({
            id: key, ...value,
            date: new Date(value.createdAt || Date.now()).toISOString()
        }));
        items.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
        callback(items);
    });
}

export async function clearNotifications() {
    await remove(ref(rtdb, 'pass_notifications'));
    return { success: true };
}

export async function deleteNotification(notifId) {
    await remove(ref(rtdb, `pass_notifications/${notifId}`));
    return { success: true };
}

export async function getUserNotifications(uid) {
    try {
        const data = (await get(ref(rtdb, 'pass_notifications'))).val();
        if (!data) return [];
        return Object.entries(data)
            .filter(([_, v]) => v.uid === uid || v.firestoreUid === uid)
            .map(([key, v]) => ({ id: key, ...v }))
            .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    } catch (e) { return []; }
}

export async function getUserDoc(uid) {
    try {
        const snap = await getDoc(doc(db, 'users', uid));
        return snap.exists() ? { id: snap.id, ...snap.data() } : null;
    } catch (e) { return null; }
}

export async function updateUserProfile(uid, data) {
    try {
        await updateDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() });
        return { success: true };
    } catch (e) { return { success: false, error: e.message }; }
}

export async function updateLastLogin(uid) {
    try { await updateDoc(doc(db, 'users', uid), { lastLogin: serverTimestamp() }); } catch (e) {}
}

export async function syncCloudToLocal(uid) {
    const cols = ['alarms', 'calculations', 'timers', 'stopwatch', 'board', 'bingo', 'qrcodes', 'notes', 'exams', 'todos', 'bingo_stats'];
    let count = 0;
    for (const col of cols) {
        try {
            const q    = query(collection(db, 'users', uid, col), orderBy('createdAt', 'desc'), limit(50));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const items = snap.docs.map(d => ({
                    id: d.id, ...d.data(), isCloud: true,
                    date: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
                }));
                localStorage.setItem('mr_' + col + '_data', JSON.stringify(items));
                count++;
            }
        } catch (e) {}
    }
    localStorage.setItem('mrdev_last_sync', Date.now().toString());
    return { success: true, syncedCount: count };
}

export function clearAllLocalData() {
    const keys = ['mr_clock_alarms', 'mr_calc_history', 'mr_timer_history', 'mr_stopwatch_history', 'mr_board_data', 'mr_bingo_history', 'mr_qr_history', 'mr_notes_data', 'mr_exam_questions', 'mr_todo_tasks', 'bingo_stats'];
    keys.forEach(k => { try { localStorage.removeItem(k); } catch (e) {} });
}

logger.notifPass.loaded();
