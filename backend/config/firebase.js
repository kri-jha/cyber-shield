const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase Admin
// Note: You must provide a valid serviceAccountKey.json file in the config directory
// or use environment variables for production.
try {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized');
} catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
