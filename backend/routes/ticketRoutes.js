const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { db } = require('../config/firebase');

// Create Ticket
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, description, category, severity, isAnonymous, blurSensitive, files } = req.body;

        const newTicket = {
            userId: req.user.uid,
            userEmail: req.user.email,
            title,
            description,
            category,
            severity,
            isAnonymous,
            blurSensitive,
            evidenceFiles: files || [],
            status: 'open',
            progress: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [
                {
                    id: `msg_${Date.now()}`,
                    sender: 'system',
                    content: 'Ticket created successfully. An expert will be assigned soon.',
                    timestamp: new Date().toISOString(),
                    type: 'system'
                }
            ]
        };

        const docRef = await db.collection('tickets').add(newTicket);
        res.status(201).json({ success: true, id: docRef.id, ticket: newTicket });
    } catch (error) {
        console.error('Create Ticket Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create ticket' });
    }
});

// Get User's Tickets
router.get('/', verifyToken, async (req, res) => {
    try {
        const ticketsSnapshot = await db.collection('tickets')
            .where('userId', '==', req.user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const tickets = [];
        ticketsSnapshot.forEach(doc => {
            tickets.push({ id: doc.id, ...doc.data() });
        });

        res.json({ success: true, tickets });
    } catch (error) {
        console.error('Get Tickets Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
    }
});

module.exports = router;
