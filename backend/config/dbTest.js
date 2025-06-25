// backend/dbTest.js
const db = require('./db');

async function testConnection() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('✅ Conexión exitosa a PostgreSQL');
    console.log('Fecha/hora del servidor:', res.rows[0].now);
    
    const userCount = await db.query('SELECT COUNT(*) FROM users');
    console.log(`👤 Total usuarios: ${userCount.rows[0].count}`);
    
  } catch (err) {
    console.error('❌ Error de conexión:', err);
  }
}

testConnection();