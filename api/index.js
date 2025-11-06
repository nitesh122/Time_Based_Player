// api/index.js - Main API entry point for Vercel serverless functions
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import database connection
const db = require('../backend/src/db');

// Import routes
const timeBlockRoutes = require('../backend/src/routes/timeBlock');
const playlistRoutes = require('../backend/src/routes/playlist');
const songRoutes = require('../backend/src/routes/song');
const uploadRoutes = require('../backend/src/routes/upload');

const app = express();

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000').split(',').map(o => o.trim()).filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser or same-origin requests (no Origin header)
    if (!origin) return callback(null, true);
    
    // In development, be more permissive
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Allow Vercel preview deployments and production domains
    if (origin && (origin.includes('.vercel.app') || origin.includes('localhost'))) {
      return callback(null, true);
    }
    
    // Check against configured allowed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    console.warn(`CORS rejected origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const { error } = await db.supabase.from('time_blocks').select('block_id').limit(1);
    if (error) throw error;
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Time-Based Music Player API',
      db: 'Connected',
    });
  } catch (err) {
    console.error('DB Health Check Failed:', err.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'DB connection failed',
      error: err.message,
    });
  }
});

// Routes
app.use('/api/time-blocks', timeBlockRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/upload', uploadRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!',
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
  });
});

// Export for Vercel
module.exports = app;
