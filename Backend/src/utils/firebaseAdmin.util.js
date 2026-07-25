import { createRequire } from 'module';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const require = createRequire(import.meta.url);
const serviceAccount = require('../../serviceAccountKey.json');

if (!getApps().length) {
    initializeApp({ credential: cert(serviceAccount) });
}

export const verificarIdTokenFirebase = async (idToken) => {
    return await getAuth().verifyIdToken(idToken);
};