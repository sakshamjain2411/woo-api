import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const woo = axios.create({
  baseURL: process.env.WOO_BASE_URL,
  auth: {
    username: process.env.WOO_KEY,
    password: process.env.WOO_SECRET
  }
});