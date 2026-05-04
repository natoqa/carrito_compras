const { Pool } = require('pg');
require('dotenv').config();

// En Render usamos DATABASE_URL, localmente usamos las variables individuales
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

pool.on('connect', () => {
    console.log('✅ Base de datos conectada correctamente');
});

pool.on('error', (err) => {
    console.error('❌ ERROR CRÍTICO EN BASE DE DATOS:', err.message);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
