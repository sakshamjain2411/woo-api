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

async function getOrCreateContact(name, email) {
  // Search for existing contact by email
  const search = await zoho.get('/contacts', { params: { email } });
  const existing = search.data.contacts?.[0];
  if (existing) return existing.contact_id;

  // Create new contact
  const res = await zoho.post('/contacts', {
    contact_name: name,
    contact_type: 'customer',
    email,
  });
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
    const customerId = await getOrCreateContact(name, order.billing.email);

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

export async function sendInvoice(id) {
  try {
    await zoho.post(`/invoices/${id}/email`);
  } catch (err) {
    throw zohoError(err);
  }
}

// ── Quotes (Estimates in Zoho Books) ─────────────────────────────────────────

export async function createQuote(data) {
  const payload = {
    customer_name: data.customer_name,
    email: data.customer_email,
    line_items: data.line_items.map(item => ({
      name: item.name,
      description: item.description || '',
      quantity: item.quantity,
      rate: item.rate,
    })),
    ...(data.expiry_date ? { expiry_date: data.expiry_date } : {}),
  };

  try {
    const res = await zoho.post('/estimates', payload);
    return res.data.estimate;
  } catch (err) {
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
    await zoho.post(`/estimates/${id}/email`);
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
