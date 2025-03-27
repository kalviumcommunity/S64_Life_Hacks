const { DataTypes } = require('sequelize');
const { sequelize } = require('../postgresDatabase');
const UserSQL = require('./userSQL');

const HackSQL = sequelize.define('HackSQL', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  created_by: {
    type: DataTypes.INTEGER,
    references: {
      model: UserSQL,
      key: 'id',
    },
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // Default to current timestamp
  },
}, {
  tableName: 'hacks',  // Ensure it's using the correct table name
  timestamps: false,   // Disable automatic timestamp management
});

// Establish relationship
HackSQL.belongsTo(UserSQL, { foreignKey: 'created_by' });
UserSQL.hasMany(HackSQL, { foreignKey: 'created_by' });

module.exports = HackSQL;
