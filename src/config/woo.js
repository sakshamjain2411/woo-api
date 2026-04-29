import axios from 'axios';

export const woo = axios.create({
  baseURL: process.env.WOO_BASE_URL,
  auth: {
    username: process.env.WOO_KEY,
    password: process.env.WOO_SECRET
  }
});