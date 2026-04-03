import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function run() {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello!');
        console.log(result.response.text());
    } catch (e) {
        console.error("ERROR MESSAGE:", e.message);
        console.error("ERROR STACK:", e.stack);
        console.log("FULL ERROR JSON:", JSON.stringify(e, null, 2));
    }
}
run();
