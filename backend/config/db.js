const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST,
    port: 3306, // Standard MySQL port
    dialect: 'mysql',
    logging: false // This stops messy SQL text from filling your terminal
  }
);

module.exports = sequelize;