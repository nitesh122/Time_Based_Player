// backend/src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

// Import routes (make sure filenames are plural)
// Fix import/file-name mismatch: actual files are singular (timeBlock.js, playlist.js, song.js)
const timeBlockRoutes = require('./routes/timeBlock');
const playlistRoutes = require('./routes/playlist');
const songRoutes = require('./routes/song');
const uploadRoutes = require('./routes/upload'); // optional, keep only if you need uploads

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = (process.env.CORS_ORIGIN || '').split(',').map(o => o.trim()).filter(Boolean);
const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser or same-origin requests (no Origin header)
    if (!origin) return callback(null, true);
    // If no allowed origins configured, be permissive in dev
    if (allowedOrigins.length === 0) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (also verifies DB connection)
app.get('/api/health', async (req, res) => {
  try {
    // Supabase client: simple call to verify connectivity
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
app.use('/api/upload', uploadRoutes); // optional

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎵 Time-Based Music Player API ready!`);
});
