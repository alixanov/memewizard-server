const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const memeRoutes = require('./routes/memes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define allowed origins based on environment
const allowedOrigins = [
  'https://memewizard.vercel.app',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean); // Remove null values

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // If you use cookies or auth headers
  })
);



// Middleware
app.use(express.json({ limit: '10mb' })); // Increase limit for Base64 images

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