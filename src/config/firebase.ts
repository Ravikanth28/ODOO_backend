import * as admin from 'firebase-admin';
import path from 'path';

const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET || 'odoo-final-99107.firebasestorage.app';

// Initialize Firebase Admin with either:
// - `FIREBASE_SERVICE_ACCOUNT` (JSON string)
// - `FIREBASE_SERVICE_ACCOUNT_PATH` (path to service account file)
// - or default application credentials (e.g., GOOGLE_APPLICATION_CREDENTIALS)
if (!admin.apps.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    try {
        if (serviceAccountJson) {
            const serviceAccount = JSON.parse(serviceAccountJson);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                storageBucket: FIREBASE_STORAGE_BUCKET,
            });
        } else if (serviceAccountPath) {
            const absolutePath = path.resolve(serviceAccountPath);
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const serviceAccount = require(absolutePath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                storageBucket: FIREBASE_STORAGE_BUCKET,
            });
        } else {
            // Use default credentials (Cloud env or GOOGLE_APPLICATION_CREDENTIALS)
            admin.initializeApp({
                storageBucket: FIREBASE_STORAGE_BUCKET,
            });
        }
    } catch (err) {
        // If initialization fails, rethrow with context for easier debugging
        throw new Error(`Failed to initialize Firebase Admin: ${err instanceof Error ? err.message : String(err)}`);
    }
}

export const storage: admin.storage.Storage = admin.storage();
export const bucket = storage.bucket();

export default admin;
