import mongoose from 'mongoose';

const chunkSchema = new mongoose.Schema({
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    fileName: String,
    text: { type: String, required: true },
    embedding: { type: [Number], required: true }, // Vector field
});

const Chunk = mongoose.model('Chunk', chunkSchema);
export default Chunk;
