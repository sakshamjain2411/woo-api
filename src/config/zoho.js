import axios from 'axios';

const required = ['ZOHO_CLIENT_ID', 'ZOHO_CLIENT_SECRET', 'ZOHO_REFRESH_TOKEN', 'ZOHO_ORGANIZATION_ID'];
for (const key of required) {
  if (!process.env[key]) throw new Error(`Missing env var: ${key}`);
}

const REGION = process.env.ZOHO_REGION || 'com';
const ORG_ID = process.env.ZOHO_ORGANIZATION_ID;

let accessToken = null;
let tokenExpiresAt = 0;
let refreshPromise = null;

async function _doRefresh() {
  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN,
    client_id: process.env.ZOHO_CLIENT_ID,
    client_secret: process.env.ZOHO_CLIENT_SECRET,
    grant_type: 'refresh_token',
  });

  try {
    const res = await axios.post(`https://accounts.zoho.${REGION}/oauth/v2/token`, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    if (!res.data.access_token) {
      const err = new Error('Zoho token refresh failed');
      err.status = 503;
      err.code = 'ZOHO_AUTH_ERROR';
      throw err;
    }

    accessToken = res.data.access_token;
    tokenExpiresAt = Date.now() + (res.data.expires_in ?? 3600) * 1000;
    return accessToken;
  } catch (err) {
    if (err.code === 'ZOHO_AUTH_ERROR') throw err;
    const authErr = new Error(err.response?.data?.error_description || err.message || 'Zoho token refresh failed');
    authErr.status = 503;
    authErr.code = 'ZOHO_AUTH_ERROR';
    authErr.zohoStatus = err.response?.status;
    throw authErr;
  }
}

export async function getAccessToken() {
  if (accessToken && Date.now() < tokenExpiresAt - 60_000) return accessToken;
  if (refreshPromise) return refreshPromise;

  refreshPromise = _doRefresh().finally(() => { refreshPromise = null; });
  return refreshPromise;
}

export const zoho = axios.create({
  baseURL: `https://www.zohoapis.${REGION}/books/v3`,
});

zoho.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  config.headers.Authorization = `Zoho-oauthtoken ${token}`;
  config.params = { ...(config.params || {}), organization_id: ORG_ID };
  return config;
});
