require('dotenv').config();
const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required by Supabase
  },
});

// Helper function for queries
async function query(text, params) {
  try {
    const res = await pool.query(text, params);
    return res;
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

// Graceful shutdown (close pool on server stop)
process.on('SIGINT', async () => {
  await pool.end();
  console.log('Postgres pool has ended');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await pool.end();
  console.log('Postgres pool has ended');
  process.exit(0);
});

module.exports = {
  query,
  pool,
}; 