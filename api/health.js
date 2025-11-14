// api/health.js - Simple health check endpoint
const { setCorsHeaders, handleOptions } = require('../backend/src/config/cors');

module.exports = async (req, res) => {
  // Set CORS headers
  setCorsHeaders(res);

  // Handle OPTIONS preflight
  if (handleOptions(req, res)) return;

  try {
    // Simple health check without database for now
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      service: 'Time-Based Music Player API',
      environment: process.env.NODE_ENV || 'production',
      message: 'API is running'
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
