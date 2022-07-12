import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import { uploadFile, downloadFile, deleteFile } from '../controllers/filesController.js';

const router = express.Router();

router.post('/', checkAuth, uploadFile);

router.get('/:file', downloadFile, deleteFile);

export default router;