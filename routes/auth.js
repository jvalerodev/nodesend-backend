import express from 'express';
import { check } from 'express-validator';
import { authenticateUser, logIn, logOut } from '../controllers/authController.js';
import checkAuth from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', checkAuth, authenticateUser);

router.post('/login',
  [
    check('email', 'Invalid email address').isEmail(),
    check('password', 'Password is required').not().isEmpty()
  ],
  logIn
);

router.post('/logout', logOut);

export default router;