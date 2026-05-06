import express from 'express';
import {
  listProfilesHandler,
  getProfileHandler,
  approveCustomerHandler,
  rejectCustomerHandler,
  listOrdersHandler,
  updateOrderStatusHandler,
} from '../controllers/admin.controller.js';
import {
  getAllRequestsHandler,
  updateRequestStatusHandler,
} from '../controllers/request.controller.js';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';

const router = express.Router();

router.use(auth, isAdmin);

router.get('/profiles', listProfilesHandler);
router.get('/profiles/:id', getProfileHandler);
router.patch('/customers/:id/approve', approveCustomerHandler);
router.patch('/customers/:id/reject', rejectCustomerHandler);
router.get('/orders', listOrdersHandler);
router.patch('/orders/:id/status', updateOrderStatusHandler);
router.get('/requests', getAllRequestsHandler);
router.patch('/requests/:id', updateRequestStatusHandler);

export default router;
