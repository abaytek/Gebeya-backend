import express from 'express';
import userRoutes from './routes/userRoutes.js';
import { connectDb } from './config/db.js';
import { sliderItems, popularProducts, categories } from './products.js';
import dotenv from 'dotenv';
import cors from 'cors';

// Config
dotenv.config();
connectDb();

const app = express();

//
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false, limit: '20mb' }));
app.use(cors());

// Routes
app.get('/api/v1/products', (req, res) => {
  res.json({ sliderItems, popularProducts, categories });
});
app.use('/api/v1/auth', userRoutes);

const server = app.listen(process.env.PORT, () => {
  console.log(`Listening on port:${process.env.PORT}`);
});

process.on('unhandledRejection', (err, promise) => {
  console.log(err);
  server.close(() => process.exit(1));
});
