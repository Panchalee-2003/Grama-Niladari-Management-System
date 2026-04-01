const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});
pool.query("SELECT *, date::text as date_str FROM gn_availability ORDER BY availability_id DESC LIMIT 5")
  .then(r => { 
    fs.writeFileSync('avail_out_utf8.json', JSON.stringify(r.rows, null, 2));
    pool.end(); 
  })
  .catch(console.error);
