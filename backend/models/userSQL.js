const { DataTypes } = require('sequelize');
const { sequelize } = require('../postgresDatabase');

const UserSQL = sequelize.define('UserSQL', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'users',  // Correct table name
  timestamps: false,  // Disable automatic timestamps if not required
});

module.exports = UserSQL;
