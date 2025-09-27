// Environment configuration validation
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  APP_NAME: process.env.REACT_APP_NAME || 'Time-Based Music Player',
  APP_VERSION: process.env.REACT_APP_VERSION || '1.0.0',
  NODE_ENV: process.env.NODE_ENV || 'development'
};

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['API_URL'];
  const missing = requiredVars.filter(key => !config[key]);
  
  if (missing.length > 0) {
    console.warn('Missing environment variables:', missing);
  }
  
  return config;
};

export default validateConfig();
