import { PDFParse } from 'pdf-parse';
import { chunkText } from '../utils/textChunker.js';
import { generateEmbeddings } from '../utils/embeddings.js';
import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';

export const handleFileUpload = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded. Please upload a PDF file." });
        }

        // Initialize the parser with the file buffer
        // Note: PDFParse class automatically handles Buffer to Uint8Array conversion in constructor
        const parser = new PDFParse({ data: req.file.buffer });
        const textResult = await parser.getText();
        const extractedText = textResult.text;

        if (!extractedText || extractedText.trim().length === 0) {
            return res.status(400).json({ error: "Could not extract text from the provided PDF." });
        }

        // Chunk the text
        const chunks = chunkText(extractedText);
        
        // Generate embeddings for each chunk
        const embeddings = await generateEmbeddings(chunks);

        // Store the main document record
        const newDoc = new Document({
            fileName: req.file.originalname,
            content: extractedText,
        });
        await newDoc.save();

        // Store each chunk separately for better vector search
        const chunkDocs = chunks.map((text, index) => ({
            documentId: newDoc._id,
            fileName: req.file.originalname,
            text,
            embedding: embeddings[index]
        }));
        
        await Chunk.insertMany(chunkDocs);

        res.status(200).json({
            message: "File successfully processed, embedded, and stored in MongoDB.",
            fileName: req.file.originalname,
            numChunks: chunks.length,
            docId: newDoc._id
        });

    } catch (error) {
        console.error("❌ Error in file upload processing:", error);
        res.status(500).json({ error: `File processing failed: ${error.message}` });
    }
};
