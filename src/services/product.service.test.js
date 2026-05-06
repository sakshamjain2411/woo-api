import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/woo.js', () => ({
  woo: { get: vi.fn() }
}));

import { woo } from '../config/woo.js';
import {
  fetchAllProductIdsByAttribute,
  fetchAllProductIdsByCategory
} from './product.service.js';

beforeEach(() => vi.clearAllMocks());

describe('fetchAllProductIdsByAttribute', () => {
  it('returns all product IDs for a single page', async () => {
    woo.get.mockResolvedValueOnce({
      data: [{ id: 1 }, { id: 2 }],
      headers: { 'x-wp-totalpages': '1' }
    });
    const ids = await fetchAllProductIdsByAttribute('pa_colour', '524,871');
    expect(ids).toEqual([1, 2]);
    expect(woo.get).toHaveBeenCalledWith('/products', {
      params: { attribute: 'pa_colour', attribute_term: '524,871', per_page: 100, page: 1, _fields: 'id' }
    });
  });

  it('paginates across multiple pages', async () => {
    woo.get
      .mockResolvedValueOnce({ data: [{ id: 1 }], headers: { 'x-wp-totalpages': '2' } })
      .mockResolvedValueOnce({ data: [{ id: 2 }], headers: { 'x-wp-totalpages': '2' } });
    const ids = await fetchAllProductIdsByAttribute('pa_colour', '524');
    expect(ids).toEqual([1, 2]);
    expect(woo.get).toHaveBeenCalledTimes(2);
  });

  it('stops at 5 pages (500 product cap)', async () => {
    const page = (n) => ({ data: Array.from({ length: 100 }, (_, i) => ({ id: n * 100 + i })), headers: { 'x-wp-totalpages': '99' } });
    woo.get
      .mockResolvedValueOnce(page(0))
      .mockResolvedValueOnce(page(1))
      .mockResolvedValueOnce(page(2))
      .mockResolvedValueOnce(page(3))
      .mockResolvedValueOnce(page(4));
    const ids = await fetchAllProductIdsByAttribute('pa_colour', '524');
    expect(ids).toHaveLength(500);
    expect(woo.get).toHaveBeenCalledTimes(5);
  });

  it('defaults to 1 page when x-wp-totalpages header is malformed', async () => {
    woo.get.mockResolvedValueOnce({
      data: [{ id: 99 }],
      headers: { 'x-wp-totalpages': 'abc' }
    });
    const ids = await fetchAllProductIdsByAttribute('pa_colour', '524');
    expect(ids).toEqual([99]);
    expect(woo.get).toHaveBeenCalledTimes(1);
  });
});

describe('fetchAllProductIdsByCategory', () => {
  it('returns all product IDs for a category', async () => {
    woo.get.mockResolvedValueOnce({
      data: [{ id: 10 }, { id: 11 }],
      headers: { 'x-wp-totalpages': '1' }
    });
    const ids = await fetchAllProductIdsByCategory('12');
    expect(ids).toEqual([10, 11]);
    expect(woo.get).toHaveBeenCalledWith('/products', {
      params: { category: '12', per_page: 100, page: 1, _fields: 'id' }
    });
  });

  it('paginates across multiple pages', async () => {
    woo.get
      .mockResolvedValueOnce({ data: [{ id: 10 }], headers: { 'x-wp-totalpages': '2' } })
      .mockResolvedValueOnce({ data: [{ id: 11 }], headers: { 'x-wp-totalpages': '2' } });
    const ids = await fetchAllProductIdsByCategory('12');
    expect(ids).toEqual([10, 11]);
    expect(woo.get).toHaveBeenCalledTimes(2);
  });

  it('stops at 5 pages (500 product cap)', async () => {
    const page = (n) => ({ data: Array.from({ length: 100 }, (_, i) => ({ id: n * 100 + i })), headers: { 'x-wp-totalpages': '99' } });
    woo.get
      .mockResolvedValueOnce(page(0))
      .mockResolvedValueOnce(page(1))
      .mockResolvedValueOnce(page(2))
      .mockResolvedValueOnce(page(3))
      .mockResolvedValueOnce(page(4));
    const ids = await fetchAllProductIdsByCategory('12');
    expect(ids).toHaveLength(500);
    expect(woo.get).toHaveBeenCalledTimes(5);
  });

  it('defaults to 1 page when x-wp-totalpages header is missing', async () => {
    woo.get.mockResolvedValueOnce({
      data: [{ id: 42 }],
      headers: {}
    });
    const ids = await fetchAllProductIdsByCategory('7');
    expect(ids).toEqual([42]);
    expect(woo.get).toHaveBeenCalledTimes(1);
  });
});
