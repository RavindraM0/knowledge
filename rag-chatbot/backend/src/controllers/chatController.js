import { GoogleGenerativeAI } from '@google/generative-ai';
import Chunk from '../models/Chunk.js';
import Chat from '../models/Chat.js';
import { generateEmbeddings } from '../utils/embeddings.js';
import { v4 as uuidv4 } from 'uuid';

export const handleChat = async (req, res) => {
    try {
        let { message, history = [], sessionId } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({ error: 'Message is required.' });
        }

        // 1. Generate embedding for the user message
        const queryEmbedding = await generateEmbeddings(message);

        // 2. Perform Vector Search (using basic similarity if Atlas index not yet ready, 
        // but here we'll use the aggregate pipeline which is the standard way)
        let context = "";
        try {
            const searchResults = await Chunk.aggregate([
                {
                    $vectorSearch: {
                        index: "vector_index", // User must create this in Atlas
                        path: "embedding",
                        queryVector: queryEmbedding,
                        numCandidates: 100,
                        limit: 5
                    }
                }
            ]);

            if (searchResults && searchResults.length > 0) {
                context = searchResults.map(result => result.text).join("\n\n");
            }
        } catch (searchError) {
            console.warn("⚠️ Vector search failed (likely index not created yet):", searchError.message);
            // Fallback: No context
        }

        // 3. Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: `You are a helpful AI Knowledge Assistant. 
Answer questions based on the provided context if available. 
If the context doesn't contain the answer, use your general knowledge but mention that it wasn't in the documents.
CONTEXT:
${context || "No relevant document context found."}`,
        });

        // 4. Send message to Gemini
        const geminiHistory = history.map((msg) => ({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        // 5. Persist Chat History
        if (!sessionId) {
            sessionId = uuidv4();
        }

        let chatSession = await Chat.findOne({ sessionId });
        if (!chatSession) {
            chatSession = new Chat({ 
                sessionId, 
                title: message.substring(0, 30) + (message.length > 30 ? '...' : '') 
            });
        }

        chatSession.messages.push({ role: 'user', content: message });
        chatSession.messages.push({ role: 'assistant', content: responseText });
        chatSession.updatedAt = new Date();
        await chatSession.save();

        res.status(200).json({ 
            reply: responseText,
            sessionId: sessionId
        });

    } catch (error) {
        console.error('❌ Chat error:', error);
        res.status(500).json({ error: 'Failed to get a response from the AI. Please try again.' });
    }
};
