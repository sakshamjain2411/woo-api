import axios from 'axios';

if (!process.env.WP_BASE_URL) {
  throw new Error('Missing required env var: WP_BASE_URL');
}

export const store = axios.create({
  baseURL: `${process.env.WP_BASE_URL}/wc/store/v1`
});
