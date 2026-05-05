import { approveCustomer, rejectCustomer, getProfiles, getProfile } from '../services/admin.service.js';

export const listProfilesHandler = async (req, res, next) => {
  try {
    const { status } = req.query;
    const profiles = await getProfiles(status);
    res.json(profiles);
  } catch (err) {
    next(err);
  }
};

export const getProfileHandler = async (req, res, next) => {
  try {
    const profile = await getProfile(req.params.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

export const approveCustomerHandler = async (req, res, next) => {
  try {
    const result = await approveCustomer(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const rejectCustomerHandler = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const result = await rejectCustomer(req.params.id, reason);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
