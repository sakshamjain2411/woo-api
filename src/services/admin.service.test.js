import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/supabase.js', () => ({
  supabase: {
    auth: { admin: { getUserById: vi.fn() } },
    from: vi.fn()
  }
}));
vi.mock('../config/woo.js', () => ({
  woo: { post: vi.fn() }
}));

import { supabase } from '../config/supabase.js';
import { woo } from '../config/woo.js';
import { approveCustomer, rejectCustomer } from './admin.service.js';

beforeEach(() => vi.clearAllMocks());

describe('approveCustomer', () => {
  it('throws 404 if profile not found', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null })
    });
    await expect(approveCustomer('uid-1')).rejects.toMatchObject({ status: 404 });
  });

  it('throws 409 if already approved', async () => {
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'uid-1', approval_status: 'approved', full_name: 'Jane Doe', woo_customer_id: 42 }, error: null })
    });
    await expect(approveCustomer('uid-1')).rejects.toMatchObject({ status: 409 });
  });

  it('creates WC customer, stores woo_customer_id, returns result', async () => {
    let callCount = 0;
    supabase.from.mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { id: 'uid-1', approval_status: 'pending', full_name: 'Jane Doe' }, error: null })
        };
      }
      return {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null })
      };
    });
    supabase.auth.admin.getUserById.mockResolvedValue({ data: { user: { email: 'jane@example.com' } }, error: null });
    woo.post.mockResolvedValue({ data: { id: 99 } });

    const result = await approveCustomer('uid-1');
    expect(woo.post).toHaveBeenCalledWith('/customers', {
      email: 'jane@example.com',
      first_name: 'Jane',
      last_name: 'Doe'
    });
    expect(result).toEqual({ message: 'approved', woo_customer_id: 99 });
  });
});

describe('rejectCustomer', () => {
  it('updates approval_status to rejected with reason', async () => {
    supabase.from.mockReturnValue({
      update: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({ error: null })
    });
    const result = await rejectCustomer('uid-1', 'Incomplete documents');
    expect(result).toEqual({ message: 'rejected' });
  });
});
