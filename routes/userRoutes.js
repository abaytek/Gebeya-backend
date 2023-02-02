import express from 'express';
import { loginUsers, registerUser } from '../contollers/auth.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUsers);

export default router;
