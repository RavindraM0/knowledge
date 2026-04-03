import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error("❌ MONGODB_URI missing in .env");
            process.exit(1);
        }
        console.log('⏳ Connecting to MongoDB at:', process.env.MONGODB_URI.split('@')[1]); // Log without credentials
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, 
        });
        console.log('✅ MongoDB connected successfully');
        process.exit(0);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('Stack:', error.stack);
        process.exit(1);
    }
};

connectDB();
