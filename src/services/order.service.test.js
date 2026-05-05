import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/woo.js', () => ({
  woo: { get: vi.fn(), post: vi.fn(), put: vi.fn() }
}));

import { woo } from '../config/woo.js';
import { fetchOrdersByCustomerId } from './order.service.js';

beforeEach(() => vi.clearAllMocks());

describe('fetchOrdersByCustomerId', () => {
  it('fetches orders by WC customer ID without a pre-lookup', async () => {
    woo.get.mockResolvedValue({ data: [{ id: 1 }, { id: 2 }] });
    const result = await fetchOrdersByCustomerId(42);
    expect(woo.get).toHaveBeenCalledTimes(1);
    expect(woo.get).toHaveBeenCalledWith('/orders', { params: { customer: 42, per_page: 50 } });
    expect(result).toHaveLength(2);
  });
});
