import express from 'express';
import multer from 'multer';
import { handleFileUpload } from '../controllers/uploadController.js';

const router = express.Router();

// Setup multer memory storage (stores file buffer in memory)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// POST /api/upload
router.post('/', upload.single('file'), handleFileUpload);

export default router;
