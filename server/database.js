const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ablego',
    password: '020507',
    port: 5432
});

module.exports = pool;