import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';
dotenv.config();

const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

/**
 * Generates embeddings for a given text or array of texts using Hugging Face Inference API.
 * @param {string|Array<string>} input - Text(s) to embed
 * @returns {Promise<Array<number>|Array<Array<number>>>} - The generated embeddings
 */
export const generateEmbeddings = async (input) => {
    try {
        if (!process.env.HF_ACCESS_TOKEN) {
            throw new Error('HF_ACCESS_TOKEN is missing in .env');
        }

        const response = await hf.featureExtraction({
            model: 'sentence-transformers/all-MiniLM-L6-v2',
            inputs: input,
        });

        return response;
    } catch (error) {
        console.error('❌ Embedding generation error:', error.message);
        throw error;
    }
};
