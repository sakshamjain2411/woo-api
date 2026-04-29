import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const store = axios.create({
  baseURL: `${process.env.WP_BASE_URL}/wc/store/v1`
});
