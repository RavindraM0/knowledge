import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello!');
        console.log(result.response.text());
        fs.writeFileSync('error.json', JSON.stringify({ success: true, text: result.response.text() }));
    } catch (e) {
        fs.writeFileSync('error.json', JSON.stringify({ error: true, message: e.message, status: e.status, stack: e.stack, all: e }, null, 2));
    }
}
run();
