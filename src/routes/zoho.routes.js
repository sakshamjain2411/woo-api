import express from 'express';
import { auth } from '../middleware/auth.js';
import { isAdmin } from '../middleware/isAdmin.js';
import {
  getContactsHandler,
  createCustomInvoiceHandler,
  createInvoiceHandler,
  getInvoicesHandler,
  getInvoiceHandler,
  downloadInvoicePdfHandler,
  sendInvoiceHandler,
  markInvoiceStatusHandler,
  createQuoteHandler,
  getQuotesHandler,
  getQuoteHandler,
  sendQuoteHandler,
  updateQuoteStatusHandler,
  convertQuoteToInvoiceHandler,
} from '../controllers/zoho.controller.js';

const router = express.Router();

router.use(auth, isAdmin);

router.get('/contacts',            getContactsHandler);

router.post('/invoices/custom',    createCustomInvoiceHandler);
router.post('/invoices',           createInvoiceHandler);
router.get('/invoices',            getInvoicesHandler);
router.get('/invoices/:id',          getInvoiceHandler);
router.get('/invoices/:id/pdf',      downloadInvoicePdfHandler);
router.post('/invoices/:id/send',    sendInvoiceHandler);
router.patch('/invoices/:id/status', markInvoiceStatusHandler);

router.post('/quotes',                    createQuoteHandler);
router.get('/quotes',                     getQuotesHandler);
router.get('/quotes/:id',                 getQuoteHandler);
router.post('/quotes/:id/send',           sendQuoteHandler);
router.patch('/quotes/:id/status',        updateQuoteStatusHandler);
router.post('/quotes/:id/convert',        convertQuoteToInvoiceHandler);

export default router;
