const Sequelize = require('sequelize');

const db = new Sequelize('mysql://root:sElHAkatAmocdzMFZIccZHKASkWHWymt@tokaido.proxy.rlwy.net:43983/railway', {
  logging: false,
});

module.exports = db;