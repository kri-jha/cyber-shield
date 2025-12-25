const admin = require('firebase-admin');

// Initialize Firebase Admin
// Support both Environment Variable (Production) and Local File (Development)
let serviceAccount;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        // Production: Parse the JSON string from Environment Variable
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        // Development: Load from local file
        serviceAccount = require('./serviceAccountKey.json');
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin Initialized Successfully');
} catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth, admin };
