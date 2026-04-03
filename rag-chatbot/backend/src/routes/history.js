import express from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat.js';

const router = express.Router();

// GET /api/history - Get all chat sessions
router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            console.warn("⚠️ MongoDB not connected yet. Returning empty history.");
            return res.status(200).json([]);
        }

        const chats = await Chat.find().sort({ updatedAt: -1 }).select('sessionId title updatedAt');
        res.status(200).json(chats);
    } catch (error) {
        console.error("❌ Error fetching history:", error);
        res.status(500).json({ error: "Failed to fetch chat history." });
    }
});

// GET /api/history/:sessionId - Get messages for a specific session
router.get('/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const chat = await Chat.findOne({ sessionId });
        if (!chat) {
            return res.status(404).json({ error: "Chat session not found." });
        }
        res.status(200).json(chat);
    } catch (error) {
        console.error("❌ Error fetching session:", error);
        res.status(500).json({ error: "Failed to fetch session details." });
    }
});

export default router;
