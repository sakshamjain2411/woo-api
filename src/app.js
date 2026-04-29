import './config/env.js';
import express from 'express';
import cors from 'cors';

import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import cartRoutes from './routes/cart.routes.js';
import customerRoutes from './routes/customer.routes.js';
import wishlistRoutes from './routes/wishlist.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/wishlist', wishlistRoutes);

app.use(errorHandler);

const PORT = process.env.PORT;
if (!PORT) throw new Error('PORT environment variable is not set');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
