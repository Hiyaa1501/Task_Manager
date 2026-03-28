const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Task = sequelize.define("Task", {
  title: {
    type: DataTypes.STRING,
    allowNull: false // A note must have a title
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  // ADD THIS LINE: It links the task to your User table
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Task;