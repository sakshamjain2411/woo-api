import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../services/product.service.js', () => ({
  fetchAllProductIdsByAttribute: vi.fn(),
  fetchAllProductIdsByCategory: vi.fn(),
  fetchProductsByIds: vi.fn(),
}));

import {
  fetchAllProductIdsByAttribute,
  fetchAllProductIdsByCategory,
  fetchProductsByIds,
} from '../services/product.service.js';
import { multiFilterProducts } from './product.controller.js';

const mockNext = vi.fn();
const mockRes = { json: vi.fn() };

beforeEach(() => vi.clearAllMocks());

describe('multiFilterProducts', () => {
  it('intersects two attribute filters and returns paginated results', async () => {
    fetchAllProductIdsByAttribute
      .mockResolvedValueOnce([1, 2, 3, 4])
      .mockResolvedValueOnce([2, 3, 5]);
    fetchProductsByIds.mockResolvedValue([{ id: 2 }, { id: 3 }]);

    const req = { query: { 'pa_colour': '524', 'pa_shape': '18', page: '1', per_page: '20' } };
    await multiFilterProducts(req, mockRes, mockNext);

    expect(fetchAllProductIdsByAttribute).toHaveBeenCalledWith('pa_colour', '524');
    expect(fetchAllProductIdsByAttribute).toHaveBeenCalledWith('pa_shape', '18');
    expect(fetchProductsByIds).toHaveBeenCalledWith([2, 3]);
    expect(mockRes.json).toHaveBeenCalledWith({
      products: expect.any(Array),
      total: 2,
      totalPages: 1,
    });
  });

  it('further intersects with category when provided', async () => {
    fetchAllProductIdsByAttribute.mockResolvedValueOnce([1, 2, 3]);
    fetchAllProductIdsByCategory.mockResolvedValueOnce([2, 3, 4]);
    fetchProductsByIds.mockResolvedValue([{ id: 2 }, { id: 3 }]);

    const req = { query: { 'pa_colour': '524', category: '12', page: '1', per_page: '20' } };
    await multiFilterProducts(req, mockRes, mockNext);

    expect(fetchAllProductIdsByCategory).toHaveBeenCalledWith('12');
    expect(fetchProductsByIds).toHaveBeenCalledWith([2, 3]);
  });

  it('paginates the intersected ID set', async () => {
    const allIds = Array.from({ length: 25 }, (_, i) => i + 1);
    fetchAllProductIdsByAttribute.mockResolvedValueOnce(allIds);
    fetchProductsByIds.mockResolvedValue(Array.from({ length: 5 }, (_, i) => ({ id: i + 21 })));

    const req = { query: { 'pa_colour': '524', page: '2', per_page: '20' } };
    await multiFilterProducts(req, mockRes, mockNext);

    expect(fetchProductsByIds).toHaveBeenCalledWith(Array.from({ length: 5 }, (_, i) => i + 21));
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({ total: 25, totalPages: 2 }));
  });

  it('returns empty results when intersection is empty', async () => {
    fetchAllProductIdsByAttribute
      .mockResolvedValueOnce([1, 2])
      .mockResolvedValueOnce([3, 4]);
    fetchProductsByIds.mockResolvedValue([]);

    const req = { query: { 'pa_colour': '524', 'pa_shape': '18', page: '1', per_page: '20' } };
    await multiFilterProducts(req, mockRes, mockNext);

    expect(fetchProductsByIds).toHaveBeenCalledWith([]);
    expect(mockRes.json).toHaveBeenCalledWith({ products: [], total: 0, totalPages: 0 });
  });

  it('calls next with error on service failure', async () => {
    fetchAllProductIdsByAttribute.mockRejectedValueOnce(new Error('woo down'));
    const req = { query: { 'pa_colour': '524', page: '1', per_page: '20' } };
    await multiFilterProducts(req, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
