const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  //port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed', err.stack);
  } else {
    console.log('Connected to MySQL database');
  }
});

module.exports = db;
