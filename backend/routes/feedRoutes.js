const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Get Feed Posts
router.get('/', async (req, res) => {
    try {
        // In a real app, this would query a 'feed_posts' collection in Firestore
        // For now, let's just return a placeholder or query if validation allows.
        // Assuming we populate Firestore with the posts later.

        // Use mock data fallback if DB empty for demo purposes?
        // Or expect DB to be populated.
        // Let's rely on DB.

        const feedSnapshot = await db.collection('feed_posts').orderBy('timestamp', 'desc').limit(20).get();
        const posts = [];
        feedSnapshot.forEach(doc => {
            posts.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, posts });
    } catch (error) {
        console.error('Feed Error:', error);
        res.status(500).json({ success: false, message: 'Failed to load feed' });
    }
});

module.exports = router;
