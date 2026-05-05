import express from 'express';
import { approveCustomerHandler, rejectCustomerHandler } from '../controllers/admin.controller.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.patch('/customers/:id/approve', auth, isAdmin, approveCustomerHandler);
router.patch('/customers/:id/reject', auth, isAdmin, rejectCustomerHandler);

export default router;
