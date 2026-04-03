import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    title: { type: String, default: 'New Chat' },
    messages: [{
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    }],
    updatedAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model('Chat', chatSchema);
export default Chat;
