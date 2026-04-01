const { Sequelize } = require('sequelize');
const path = require('path');

// Loads local .env if it exists, otherwise uses Render's Env Variables
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306, // Aiven uses a special port like 21869
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: process.env.DB_HOST && process.env.DB_HOST !== '127.0.0.1' ? {
        require: true,
        rejectUnauthorized: false // Required for Aiven Cloud
      } : false
    }
  }
);

// Verify variables are loading in Render Logs
if (!process.env.DB_USER) {
    console.error("ERROR: Database variables not found in Environment!");
} else {
    console.log(`Connecting to database as user: ${process.env.DB_USER}`);
}

module.exports = sequelize;