import { zoho } from '../config/zoho.js';
import { fetchOrderById } from './order.service.js';

function zohoError(err) {
  const message = err.response?.data?.message || err.message || 'Zoho API error';
  const status = err.response?.status || 500;
  const error = new Error(message);
  error.status = status;
  error.code = 'ZOHO_API_ERROR';
  return error;
}

async function getOrCreateContact(name, email, details = {}) {
  const search = await zoho.get('/contacts', { params: { email } });
  const existing = search.data.contacts?.[0];
  if (existing) return existing.contact_id;

  const body = {
    contact_name: name,
    contact_type: 'customer',
    ...(details.company ? { company_name: details.company } : {}),
    contact_persons: [{ email, is_primary_contact: true, ...(details.phone ? { phone: details.phone } : {}) }],
  };

  if (details.billing) {
    const b = details.billing;
    body.billing_address = {
      address: [b.address_1, b.address_2].filter(Boolean).join(', '),
      city:    b.city,
      state:   b.state,
      zip:     b.postcode,
      country: b.country,
    };
  }

  const res = await zoho.post('/contacts', body);
  return res.data.contact.contact_id;
}

// ── Contacts ─────────────────────────────────────────────────────────────────

export async function getContacts() {
  try {
    const res = await zoho.get('/contacts', { params: { contact_type: 'customer', status: 'active' } });
    return res.data.contacts ?? [];
  } catch (err) {
    throw zohoError(err);
  }
}

// ── Invoices ──────────────────────────────────────────────────────────────────

export async function createCustomInvoice(data) {
  try {
    const customerId = await getOrCreateContact(data.customer_name, data.customer_email);

    const payload = {
      customer_id: customerId,
      currency_code: data.currency_code || 'AUD',
      line_items: data.line_items.map(item => ({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        rate: item.rate,
      })),
      ...(data.due_date ? { due_date: data.due_date } : {}),
    };

    const res = await zoho.post('/invoices', payload);
    return res.data.invoice;
  } catch (err) {
    if (err.code === 'ZOHO_API_ERROR') throw err;
    throw zohoError(err);
  }
}

export async function createInvoice(orderId) {
  const order = await fetchOrderById(orderId);

  const lineItems = order.line_items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    rate: parseFloat(item.price),
  }));

  if (parseFloat(order.shipping_total) > 0) {
    lineItems.push({
      name: 'Shipping',
      quantity: 1,
      rate: parseFloat(order.shipping_total),
    });
  }

  try {
    const name = `${order.billing.first_name} ${order.billing.last_name}`.trim();
    const customerId = await getOrCreateContact(name, order.billing.email, {
      phone:   order.billing.phone,
      company: order.billing.company,
      billing: order.billing,
    });

    const payload = {
      customer_id: customerId,
      reference_number: String(order.id),
      currency_code: order.currency,
      line_items: lineItems,
      billing_address: {
        address: order.billing.address_1,
        city: order.billing.city,
        state: order.billing.state,
        zip: order.billing.postcode,
        country: order.billing.country,
      },
    };

    const res = await zoho.post('/invoices', payload);
    return res.data.invoice;
  } catch (err) {
    if (err.code === 'ZOHO_API_ERROR') throw err;
    throw zohoError(err);
  }
}

export async function getInvoices() {
  try {
    const res = await zoho.get('/invoices');
    return res.data.invoices;
  } catch (err) {
    throw zohoError(err);
  }
}

export async function getInvoice(id) {
  try {
    const res = await zoho.get(`/invoices/${id}`);
    return res.data.invoice;
  } catch (err) {
    throw zohoError(err);
  }
}

export async function downloadInvoicePdf(id) {
  try {
    const res = await zoho.get(`/invoices/${id}`, {
      params: { accept: 'pdf' },
      responseType: 'arraybuffer',
    });
    return res.data;
  } catch (err) {
    throw zohoError(err);
  }
}

export async function sendInvoice(id) {
  try {
    const inv = await zoho.get(`/invoices/${id}`);
    const email = inv.data.invoice.email;
    await zoho.post(`/invoices/${id}/email`, { to_mail_ids: [email] });
  } catch (err) {
    throw zohoError(err);
  }
}

export async function markInvoiceStatus(id, status) {
  try {
    const res = await zoho.post(`/invoices/${id}/status/${status}`);
    return res.data.invoice ?? res.data;
  } catch (err) {
    throw zohoError(err);
  }
}

// ── Quotes (Estimates in Zoho Books) ─────────────────────────────────────────

export async function createQuote(data) {
  try {
    const customerId = await getOrCreateContact(data.customer_name, data.customer_email);

    const payload = {
      customer_id: customerId,
      line_items: data.line_items.map(item => ({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        rate: item.rate,
      })),
      ...(data.expiry_date ? { expiry_date: data.expiry_date } : {}),
    };

    const res = await zoho.post('/estimates', payload);
    return res.data.estimate;
  } catch (err) {
    if (err.code === 'ZOHO_API_ERROR') throw err;
    throw zohoError(err);
  }
}

export async function getQuotes() {
  try {
    const res = await zoho.get('/estimates');
    return res.data.estimates;
  } catch (err) {
    throw zohoError(err);
  }
}

export async function getQuote(id) {
  try {
    const res = await zoho.get(`/estimates/${id}`);
    return res.data.estimate;
  } catch (err) {
    throw zohoError(err);
  }
}

export async function sendQuote(id) {
  try {
    const est = await zoho.get(`/estimates/${id}`);
    const email = est.data.estimate.email;
    await zoho.post(`/estimates/${id}/email`, { to_mail_ids: [email] });
  } catch (err) {
    throw zohoError(err);
  }
}

export async function updateQuoteStatus(id, status) {
  try {
    const res = await zoho.post(`/estimates/${id}/status/${status}`);
    return res.data.estimate;
  } catch (err) {
    throw zohoError(err);
  }
}

export async function convertQuoteToInvoice(estimateId) {
  try {
    const estRes = await zoho.get(`/estimates/${estimateId}`);
    const est = estRes.data.estimate;

    const payload = {
      customer_id: est.customer_id,
      reference_number: est.estimate_number,
      currency_code: est.currency_code,
      line_items: est.line_items.map(item => ({
        name: item.name,
        description: item.description || '',
        quantity: item.quantity,
        rate: item.rate,
      })),
    };

    const invRes = await zoho.post('/invoices', payload);
    return invRes.data.invoice;
  } catch (err) {
    if (err.code === 'ZOHO_API_ERROR') throw err;
    throw zohoError(err);
  }
}
