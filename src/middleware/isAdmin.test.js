import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isAdmin } from './isAdmin.js';

const mockNext = vi.fn();
const mockRes = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnThis()
};

beforeEach(() => vi.clearAllMocks());

describe('isAdmin middleware', () => {
  it('calls next when customer is admin', () => {
    const req = { customer: { is_admin: true } };
    isAdmin(req, mockRes, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockRes.status).not.toHaveBeenCalled();
  });

  it('returns 403 when customer is not admin', () => {
    const req = { customer: { is_admin: false } };
    isAdmin(req, mockRes, mockNext);
    expect(mockRes.status).toHaveBeenCalledWith(403);
    expect(mockRes.json).toHaveBeenCalledWith(expect.objectContaining({
      error: expect.objectContaining({ code: 'FORBIDDEN' })
    }));
    expect(mockNext).not.toHaveBeenCalled();
  });
});
