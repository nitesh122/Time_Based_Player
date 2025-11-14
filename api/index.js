// api/index.js - Main API entry point for Vercel serverless functions
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { corsOptions } = require('../backend/src/config/cors');

let db, timeBlockRoutes, playlistRoutes, songRoutes, uploadRoutes;

// Lazy load modules to handle cold starts better
try {
  db = require('../backend/src/db');
  timeBlockRoutes = require('../backend/src/routes/timeBlock');
  playlistRoutes = require('../backend/src/routes/playlist');
  songRoutes = require('../backend/src/routes/song');
  uploadRoutes = require('../backend/src/routes/upload');
} catch (error) {
  console.error('Error loading backend modules:', error.message);
  // We'll handle this in the routes
}

const app = express();

// Middleware
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
    if (!db) {
      throw new Error('Database module not loaded');
    }
    const { error } = await db.supabase.from('time_blocks').select('block_id').limit(1);
    if (error) throw error;
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Time-Based Music Player API',
      db: 'Connected',
      environment: process.env.NODE_ENV || 'unknown'
    });
  } catch (err) {
    console.error('Health Check Failed:', err.message);
    res.status(500).json({
      status: 'ERROR',
      message: 'Health check failed',
      error: err.message,
      environment: process.env.NODE_ENV || 'unknown'
    });
  }
});

// Routes - with error handling for missing modules
if (timeBlockRoutes) {
  app.use('/api/time-blocks', timeBlockRoutes);
} else {
  app.get('/api/time-blocks*', (req, res) => {
    res.status(503).json({ error: 'Time blocks service unavailable', message: 'Module loading failed' });
  });
}

if (playlistRoutes) {
  app.use('/api/playlists', playlistRoutes);
} else {
  app.get('/api/playlists*', (req, res) => {
    res.status(503).json({ error: 'Playlists service unavailable', message: 'Module loading failed' });
  });
}

if (songRoutes) {
  app.use('/api/songs', songRoutes);
} else {
  app.get('/api/songs*', (req, res) => {
    res.status(503).json({ error: 'Songs service unavailable', message: 'Module loading failed' });
  });
}

if (uploadRoutes) {
  app.use('/api/upload', uploadRoutes);
} else {
  app.post('/api/upload*', (req, res) => {
    res.status(503).json({ error: 'Upload service unavailable', message: 'Module loading failed' });
  });
}

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
