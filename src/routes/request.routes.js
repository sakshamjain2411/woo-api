import express from 'express';
import {
  getProductRequestsHandler,
  getActiveProductIdsHandler,
  createRequestHandler,
  getUserRequestsHandler,
} from '../controllers/request.controller.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

router.get('/active-products', getActiveProductIdsHandler);
router.get('/my', getUserRequestsHandler);
router.get('/:productId', getProductRequestsHandler);
router.post('/:productId', createRequestHandler);

export default router;
