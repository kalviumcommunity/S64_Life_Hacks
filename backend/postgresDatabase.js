require('dotenv').config();  // Ensure dotenv is loaded at the top
const { Sequelize } = require('sequelize');

// Set up Sequelize to connect to your existing 'life_hacks' database
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: 'postgres',
  logging: false, // Optional: Disable logging for cleaner output
});

const connectPostgres = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to PostgreSQL database: life_hacks");
  } catch (error) {
    console.error("Unable to connect to the PostgreSQL database:", error);
  }
};

module.exports = { sequelize, connectPostgres };
