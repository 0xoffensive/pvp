import pool from './lib/db';

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

testConnection();