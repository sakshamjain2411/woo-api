import express from 'express';
import { login, getMe, updateMe } from '../controllers/customer.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);

export default router;
