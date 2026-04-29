import express from 'express';
import cors from 'cors';
import productRoutes from './routes/product.routes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/api/products', productRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});