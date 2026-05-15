// ==================== MRDEV GOOGLE AUTH v4.0 ====================
import logger from '../core/logger.js';
import { auth, db } from '../core/firebase-init.js';
import {
    GoogleAuthProvider,
    signInWithPopup
} from 'firebase/auth';
import {
    doc, setDoc, getDoc, serverTimestamp
} from 'firebase/firestore';
import { showToast } from '../core/toast.js';
import { closeModal } from '../ui/modal.js';
import { saveUserMrdevId } from '../notif-pass.js';
import { t } from '../core/i18n.js';

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export async function signInWithGoogle() {
    logger.google.start();
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        logger.google.success(user.uid, user.email);

        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || user.email?.split('@')[0] || 'User',
                photoURL: user.photoURL || null,
                provider: 'google',
                mrdevId: '',
                mrdevPassword: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                lastLogin: serverTimestamp(),
                isActive: true
            });
            logger.google.newUser();
        } else {
            await setDoc(userRef, {
                displayName: user.displayName || userSnap.data().displayName,
                photoURL: user.photoURL || userSnap.data().photoURL || null,
                lastLogin: serverTimestamp(),
                updatedAt: serverTimestamp()
            }, { merge: true });
            logger.google.existingUser();
        }

        let mrdevId = '';
        try {
            mrdevId = await saveUserMrdevId(user) || '';
            if (mrdevId) localStorage.setItem('mrdev_user_id', mrdevId);
            logger.google.mrdevId(mrdevId);
        } catch (e) {
            logger.google.mrdevIdError(e.message);
        }

        localStorage.setItem('mrdev_local_auth', JSON.stringify({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split('@')[0] || 'User',
            photoURL: user.photoURL || null,
            mrdevId: mrdevId,
            provider: 'google',
            authType: 'google',
            isLoggedIn: true,
            loginTime: Date.now()
        }));

        logger.google.localSaved(mrdevId);

        showToast(t('welcome'), 'success');
        closeModal('authModal');
        logger.auth.loginOk();

        setTimeout(() => window.location.reload(), 500);

    } catch (error) {
        logger.google.error(error.code, error.message);

        if (error.code === 'auth/popup-closed-by-user') {
            showToast(t('login') + ' oynasi yopildi', 'error');
        } else if (error.code === 'auth/network-request-failed') {
            logger.error.network(error.message);
            showToast('Internet aloqasi yo\'q', 'error');
        } else {
            showToast('Google orqali kirishda xatolik', 'error');
        }
    }
}