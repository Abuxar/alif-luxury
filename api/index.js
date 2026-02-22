import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import productRoutes from './routes/productRoutes.js';
import slideRoutes from './routes/slideRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

// Database connection state to prevent multiple connections in serverless environment
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }
  
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/alif-luxury';
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB Connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

// Apply DB connection middleware to all API routes
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Routes
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Alif Serverless API is running smoothly.' });
});

app.get('/api/sitemap.xml', async (req, res) => {
  try {
    const products = await Product.find({}).select('_id updatedAt');
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    // Add main static routes
    const staticRoutes = ['/', '/checkout', '/account'];
    for (const route of staticRoutes) {
      xml += '  <url>\n';
      xml += `    <loc>https://alif-luxury.com${route}</loc>\n`;
      xml += '    <changefreq>daily</changefreq>\n';
      xml += '    <priority>1.0</priority>\n';
      xml += '  </url>\n';
    }

    // Add dynamic product routes
    for (const product of products) {
      xml += '  <url>\n';
      xml += `    <loc>https://alif-luxury.com/?product=${product._id}</loc>\n`;
      xml += `    <lastmod>${new Date(product.updatedAt || Date.now()).toISOString()}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }
    
    xml += '</urlset>';

    res.header('Content-Type', 'application/xml');
    res.status(200).send(xml);
  } catch (error) {
    console.error('Sitemap Generation Error:', error);
    res.status(500).end();
  }
});

app.use('/api/products', productRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);

// Export the Express app for Vercel Serverless Functions
export default app;
