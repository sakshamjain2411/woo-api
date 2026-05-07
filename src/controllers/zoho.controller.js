import * as zoho from '../services/zoho.service.js';

function badRequest(res, message) {
  return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message, status: 400 } });
}

// ── Contacts ──────────────────────────────────────────────────────────────────

export const getContactsHandler = async (req, res, next) => {
  try {
    const contacts = await zoho.getContacts();
    res.json(contacts);
  } catch (err) { next(err); }
};

// ── Invoices ──────────────────────────────────────────────────────────────────

export const createCustomInvoiceHandler = async (req, res, next) => {
  try {
    const { customer_name, customer_email, line_items } = req.body;
    if (!customer_name) return badRequest(res, 'customer_name is required');
    if (!customer_email) return badRequest(res, 'customer_email is required');
    if (!Array.isArray(line_items) || line_items.length === 0) return badRequest(res, 'line_items must be a non-empty array');
    for (const item of line_items) {
      if (!item.name || item.quantity == null || item.rate == null) return badRequest(res, 'Each line item requires name, quantity, and rate');
    }
    const invoice = await zoho.createCustomInvoice(req.body);
    res.status(201).json(invoice);
  } catch (err) { next(err); }
};

export const createInvoiceHandler = async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (!orderId) return badRequest(res, 'orderId is required');
    const invoice = await zoho.createInvoice(orderId);
    res.status(201).json(invoice);
  } catch (err) { next(err); }
};

export const getInvoicesHandler = async (req, res, next) => {
  try {
    const invoices = await zoho.getInvoices();
    res.json(invoices);
  } catch (err) { next(err); }
};

export const getInvoiceHandler = async (req, res, next) => {
  try {
    const invoice = await zoho.getInvoice(req.params.id);
    res.json(invoice);
  } catch (err) { next(err); }
};

export const downloadInvoicePdfHandler = async (req, res, next) => {
  try {
    const pdf = await zoho.downloadInvoicePdf(req.params.id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${req.params.id}.pdf"`);
    res.send(Buffer.from(pdf));
  } catch (err) { next(err); }
};

export const sendInvoiceHandler = async (req, res, next) => {
  try {
    await zoho.sendInvoice(req.params.id);
    res.json({ message: 'Invoice sent' });
  } catch (err) { next(err); }
};

export const markInvoiceStatusHandler = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['sent', 'paid', 'void'].includes(status)) return badRequest(res, 'status must be sent, paid, or void');
    const result = await zoho.markInvoiceStatus(req.params.id, status);
    res.json(result);
  } catch (err) { next(err); }
};

// ── Quotes ────────────────────────────────────────────────────────────────────

export const createQuoteHandler = async (req, res, next) => {
  try {
    const { customer_name, customer_email, line_items } = req.body;
    if (!customer_name) return badRequest(res, 'customer_name is required');
    if (!customer_email) return badRequest(res, 'customer_email is required');
    if (!Array.isArray(line_items) || line_items.length === 0) return badRequest(res, 'line_items must be a non-empty array');
    for (const item of line_items) {
      if (!item.name || item.quantity == null || item.rate == null) return badRequest(res, 'Each line item requires name, quantity, and rate');
    }
    const quote = await zoho.createQuote(req.body);
    res.status(201).json(quote);
  } catch (err) { next(err); }
};

export const getQuotesHandler = async (req, res, next) => {
  try {
    const quotes = await zoho.getQuotes();
    res.json(quotes);
  } catch (err) { next(err); }
};

export const getQuoteHandler = async (req, res, next) => {
  try {
    const quote = await zoho.getQuote(req.params.id);
    res.json(quote);
  } catch (err) { next(err); }
};

export const sendQuoteHandler = async (req, res, next) => {
  try {
    await zoho.sendQuote(req.params.id);
    res.json({ message: 'Quote sent' });
  } catch (err) { next(err); }
};

export const updateQuoteStatusHandler = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['sent', 'accepted', 'declined', 'void'].includes(status)) return badRequest(res, 'status must be sent, accepted, declined, or void');
    const quote = await zoho.updateQuoteStatus(req.params.id, status);
    res.json(quote);
  } catch (err) { next(err); }
};

export const convertQuoteToInvoiceHandler = async (req, res, next) => {
  try {
    const invoice = await zoho.convertQuoteToInvoice(req.params.id);
    res.status(201).json(invoice);
  } catch (err) { next(err); }
};
