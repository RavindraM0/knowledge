import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// If adding vector search index later, we'll need it here
const Document = mongoose.model('Document', documentSchema);
export default Document;
