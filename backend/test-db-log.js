import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const logFile = 'db_error.log';

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            fs.writeFileSync(logFile, "❌ MONGODB_URI missing in .env");
            process.exit(1);
        }
        console.log('⏳ Connecting...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, 
        });
        fs.writeFileSync(logFile, '✅ MongoDB connected successfully');
        process.exit(0);
    } catch (error) {
        fs.writeFileSync(logFile, `❌ Error: ${error.message}\nStack: ${error.stack}`);
        process.exit(1);
    }
};

connectDB();
