const { Sequelize } = require('sequelize');
require('dotenv').config();

// Option A: Using hardcoded strings (Easy for testing)
const sequelize = new Sequelize('task_manager_db', 'root', 'Hiya15', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = sequelize;