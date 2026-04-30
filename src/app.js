import './config/env.js';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';
import customerRoutes from './routes/customer.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:4200'];

app.use(helmet());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests', status: 429 } }
});

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/customers', authLimiter, customerRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;
if (!PORT) throw new Error('PORT environment variable is not set');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
