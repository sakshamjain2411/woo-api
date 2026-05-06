import {
  getRequestsForProduct,
  getActiveProductIds,
  createRequest,
  updateRequestStatus,
  rejectOtherRequests,
  getAllRequests,
  getRequestsByUser,
} from '../services/request.service.js';
import { fetchProductById } from '../services/product.service.js';

export const getUserRequestsHandler = async (req, res, next) => {
  try {
    const requests = await getRequestsByUser(req.customer.id);
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

export const getProductRequestsHandler = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const requests = await getRequestsForProduct(productId);
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

export const getActiveProductIdsHandler = async (req, res, next) => {
  try {
    const ids = await getActiveProductIds();
    res.json(ids);
  } catch (err) {
    next(err);
  }
};

export const createRequestHandler = async (req, res, next) => {
  try {
    const productId = parseInt(req.params.productId);
    const userId = req.customer.id;

    // Prevent duplicate pending request from same user
    const existing = await getRequestsForProduct(productId);
    const userHasPending = existing.some(r => r.user_id === userId && r.status === 'pending');
    if (userHasPending) {
      return res.status(409).json({ error: { code: 'ALREADY_REQUESTED', message: 'You already have a pending request for this product', status: 409 } });
    }
    const hasAccepted = existing.some(r => r.status === 'accepted');
    if (hasAccepted) {
      return res.status(409).json({ error: { code: 'OUT_ON_APPROVAL', message: 'This product is currently out on approval', status: 409 } });
    }

    const product = await fetchProductById(productId);
    const productName = product.name ?? `Product #${productId}`;
    const customerName = req.customer.full_name || req.customer.email;
    const customerEmail = req.customer.email;

    const request = await createRequest(productId, userId, productName, customerName, customerEmail);
    res.status(201).json(request);
  } catch (err) {
    next(err);
  }
};

export const getAllRequestsHandler = async (req, res, next) => {
  try {
    const requests = await getAllRequests();
    res.json(requests);
  } catch (err) {
    next(err);
  }
};

export const updateRequestStatusHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['accepted', 'rejected', 'completed', 'failed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: { code: 'INVALID_STATUS', message: `Status must be one of: ${allowed.join(', ')}`, status: 400 } });
    }

    const updated = await updateRequestStatus(id, status);

    // When accepting, auto-reject all other pending requests for this product
    if (status === 'accepted') {
      await rejectOtherRequests(updated.product_id, id);
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
};
