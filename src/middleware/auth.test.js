import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../config/supabase.js', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn()
  }
}));

import { supabase } from '../config/supabase.js';
import { auth } from './auth.js';

const mockNext = vi.fn();
const mockRes = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis()
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('auth middleware', () => {
  it('returns 401 when no Authorization header', async () => {
    const req = { headers: {} };
    await auth(req, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('returns 401 when token is invalid', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: new Error('invalid') });
    const req = { headers: { authorization: 'Bearer badtoken' } };
    await auth(req, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(401);
  });

  it('returns 503 PROFILE_NOT_FOUND when no profile row exists', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'uid-1', email: 'a@b.com' } }, error: null });
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null })
    });
    const req = { headers: { authorization: 'Bearer validtoken' } };
    await auth(req, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.objectContaining({ code: 'PROFILE_NOT_FOUND' })
    }));
  });

  it('returns 503 WOO_ID_NOT_MAPPED when woo_customer_id is null', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'uid-1', email: 'a@b.com' } }, error: null });
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'uid-1', woo_customer_id: null, is_admin: false }, error: null })
    });
    const req = { headers: { authorization: 'Bearer validtoken' } };
    await auth(req, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(503);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.objectContaining({ code: 'WOO_ID_NOT_MAPPED' })
    }));
  });

  it('attaches woo_customer_id to req.customer and calls next when valid', async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'uid-1', email: 'a@b.com' } }, error: null });
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: { id: 'uid-1', woo_customer_id: 42, is_admin: false }, error: null })
    });
    const req = { headers: { authorization: 'Bearer validtoken' } };
    await auth(req, mockRes, mockNext);
    expect(req.customer).toEqual({ id: 'uid-1', email: 'a@b.com', woo_customer_id: 42, is_admin: false });
    expect(mockNext).toHaveBeenCalled();
  });
});
