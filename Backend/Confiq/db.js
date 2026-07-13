const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'tokaido.proxy.rlwy.net',
  port: 43983,
  user: 'root',
  password: 'sElHAkatAmocdzMFZIccZHKASkWHWymt',
  database: 'railway'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database successfully');
});

module.exports = connection;
