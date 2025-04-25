const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const memeRoutes = require('./routes/memes');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Verify .env loading
console.log('Environment variables:', {
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? '[REDACTED]' : undefined,
  NODE_ENV: process.env.NODE_ENV,
});

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify Cloudinary configuration
console.log('Cloudinary config:', {
  cloud_name: cloudinary.config().cloud_name,
  api_key: cloudinary.config().api_key,
  api_secret: cloudinary.config().api_secret ? '[REDACTED]' : undefined,
});

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins
const allowedOrigins = [
  'https://memewizard.vercel.app',
  ...(process.env.NODE_ENV !== 'production'
    ? ['http://localhost:3000', 'http://localhost:3001']
    : []),
];

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Request origin:', origin);
      console.log('Allowed origins:', allowedOrigins);
      if (!origin) {
        console.log('No origin, allowing request');
        return callback(null, true);
      }
      const normalizedOrigin = origin.replace(/\/$/, '');
      if (allowedOrigins.includes(normalizedOrigin)) {
        console.log(`Origin ${normalizedOrigin} allowed`);
        return callback(null, true);
      }
      console.error(`Origin ${normalizedOrigin} not allowed by CORS`);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Middleware

app.use(express.json({ limit: '10mb' })); // Support large Base64 images

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/memes', memeRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// Start Server
app.listen(PORT, () => console.log(`сервер ${PORT} запущен`));