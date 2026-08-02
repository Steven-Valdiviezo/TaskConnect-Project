import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const require = createRequire(import.meta.url);

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
    ? JSON.parse(readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, 'utf-8'))
    : require('../../serviceAccountKey.json');

if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
}

export const verificarIdTokenFirebase = async (idToken) => {
    return await getAuth().verifyIdToken(idToken);
};