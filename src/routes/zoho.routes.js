import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import {
  getContactsHandler,
  createCustomInvoiceHandler,
  createInvoiceHandler,
  getInvoicesHandler,
  getInvoiceHandler,
  sendInvoiceHandler,
  createQuoteHandler,
  getQuotesHandler,
  getQuoteHandler,
  sendQuoteHandler,
  updateQuoteStatusHandler,
} from '../controllers/zoho.controller.js';

const router = express.Router();

router.use(auth, isAdmin);

router.get('/contacts',            getContactsHandler);

router.post('/invoices/custom',    createCustomInvoiceHandler);
router.post('/invoices',           createInvoiceHandler);
router.get('/invoices',            getInvoicesHandler);
router.get('/invoices/:id',        getInvoiceHandler);
router.post('/invoices/:id/send',  sendInvoiceHandler);

router.post('/quotes',             createQuoteHandler);
router.get('/quotes',              getQuotesHandler);
router.get('/quotes/:id',          getQuoteHandler);
router.post('/quotes/:id/send',    sendQuoteHandler);
router.patch('/quotes/:id/status', updateQuoteStatusHandler);

export default router;
