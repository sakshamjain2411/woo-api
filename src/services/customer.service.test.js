import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/supabase.js', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn()
    }
  }
}));

vi.mock('../config/woo.js', () => ({
  woo: {
    get: vi.fn(),
    put: vi.fn()
  }
}));

import { supabase } from '../config/supabase.js';
import { woo } from '../config/woo.js';
import { fetchWooCustomer, updateWooCustomer } from './customer.service.js';

beforeEach(() => vi.clearAllMocks());

describe('fetchWooCustomer', () => {
  it('fetches customer by WC ID', async () => {
    woo.get.mockResolvedValue({ data: { id: 42, email: 'a@b.com' } });
    const result = await fetchWooCustomer(42);
    expect(woo.get).toHaveBeenCalledWith('/customers/42');
    expect(result).toEqual({ id: 42, email: 'a@b.com' });
  });
});

describe('updateWooCustomer', () => {
  it('updates customer by WC ID directly', async () => {
    woo.put.mockResolvedValue({ data: { id: 42, first_name: 'Jane' } });
    const result = await updateWooCustomer(42, { first_name: 'Jane' });
    expect(woo.put).toHaveBeenCalledWith('/customers/42', { first_name: 'Jane' });
    expect(result).toEqual({ id: 42, first_name: 'Jane' });
  });
});
