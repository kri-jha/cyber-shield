const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { db } = require('../config/firebase');

// Login / Verify User
// The actual login happens on frontend via Firebase SDK.
// This route is to verify the token and get/create user profile in Firestore.
router.post('/login', verifyToken, async (req, res) => {
    try {
        const { uid, email, name, picture } = req.user;

        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            // Create new user profile if not exists
            await userRef.set({
                uid,
                email,
                name: name || 'Anonymous',
                picture: picture || '',
                createdAt: new Date().toISOString(),
                role: 'user'
            });
        }

        res.json({ message: 'User authenticated', user: req.user });
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/profile', verifyToken, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.user.uid);
        const doc = await userRef.get();
        if (doc.exists) {
            res.json(doc.data());
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
