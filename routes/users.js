import express from 'express';
import { check, oneOf } from 'express-validator';
import { register } from '../controllers/usersController.js';

const router = express.Router();

router.post('/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Invalid email address').isEmail(),
    check('password', 'The password must be at least 6 characters').isLength({ min: 6 }),
    check('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      } else {
        return value;
      }
    })
  ],
  register
);

export default router;