import express from 'express';
import { check } from 'express-validator';
import checkAuth from '../middleware/authMiddleware.js';
import { newLink, hasPassword, getLinks, getLink, validatePassword } from '../controllers/linksController.js';

const router = express.Router();

router.post('/',
  [
    check('filename', 'Upload a file').not().isEmpty(),
    check('originalName', 'Upload a file').not().isEmpty()
  ],
  checkAuth,
  newLink
);

router.get('/', getLinks);

router
  .route('/:url')
  .get(hasPassword, getLink)
  .post(validatePassword, getLink);

export default router;