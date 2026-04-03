import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import uploadRoutes from './routes/upload.js';
import chatRoutes from './routes/chat.js';
import historyRoutes from './routes/history.js';

dotenv.config();

process.on('uncaughtException', (err) => {
    console.error('🔥 CRITICAL: Uncaught Exception:', err.message);
    console.error(err.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('🌊 CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(cors()); // Allow all origins for development
app.use(express.json());

// Basic health check route
app.get('/', (req, res) => {
    res.json({ message: 'RAG Chatbot API is running!' });
});

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/history', historyRoutes);

// Database Connection function
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn("⚠️ MONGODB_URI is not defined in .env. Persistence will not work!");
            return;
        }
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, 
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
    }
};

// Start Server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is listening for requests on PORT: ${PORT}`);
    console.log(`🔗 Local URL: http://localhost:${PORT}`);
});

// Connect to DB in background
connectDB().then(() => {
    console.log('🌟 Server initialization complete.');
});
