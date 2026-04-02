import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import { chunkText } from '../utils/textChunker.js';

export const handleFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded. Please upload a PDF file." });
        }

        // Buffer of the uploaded PDF file
        const dataBuffer = req.file.buffer;

        // Parse PDF to extract text
        const pdfData = await pdfParse(dataBuffer);
        const extractedText = pdfData.text;

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({ error: "Could not extract text from the provided PDF." });
        }

        // Chunk the text
        const chunks = chunkText(extractedText);

        // For now, return the chunks. In Phase 3, we will generate embeddings and save them to MongoDB.
        res.status(200).json({
            message: "File successfully processed and text chunked.",
            numChunks: chunks.length,
            chunks: chunks
        });

    } catch (error) {
        console.error("❌ Error in file upload processing:", error);
        res.status(500).json({ error: "Internal server error during file processing." });
    }
};
