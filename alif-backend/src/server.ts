import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

import productRoutes from './routes/productRoutes';
import aiRoutes from './routes/aiRoutes';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alif-luxury';

// Basic healthcheck route
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Alif Backend Server is running.' });
});

app.use('/api/products', productRoutes);
app.use('/api/ai', aiRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/users', userRoutes);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
  });
