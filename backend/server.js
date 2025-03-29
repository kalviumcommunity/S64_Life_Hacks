const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDatabase = require("./database");  // MongoDB connection
const { sequelize, connectPostgres } = require("./postgresDatabase");  // PostgreSQL connection
const hackRoutes = require("./routes/routes"); // MongoDB routes
const hackRoutesSQL = require("./routes/routesSQL"); // PostgreSQL routes

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
connectDatabase();

// Connect to PostgreSQL
connectPostgres();

// Middleware for parsing JSON requests
app.use(express.json());

// Ping route (testing)
app.get("/ping", (req, res) => {
  try {
    res.send("pong");
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

// Home Route with DB Status
app.get("/", async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "Connected to MongoDB" : "Not Connected to MongoDB";
  try {
    await sequelize.authenticate(); // Just test if it's connected
    res.json({ message: "Welcome to the API", mongo_status: mongoStatus, postgres_status: "Connected to PostgreSQL" });
  } catch (error) {
    res.json({ message: "Welcome to the API", mongo_status: mongoStatus, postgres_status: "Not Connected to PostgreSQL" });
  }
});


// MongoDB Routes
app.use("/api/mongo", hackRoutes);  // Prefix all MongoDB hack routes with /api

// PostgreSQL Routes
app.use("/api/postgres", hackRoutesSQL);  // Prefix all PostgreSQL hack routes with /api

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  
  if (sequelize) {
    await sequelize.close(); // Closing PostgreSQL connection
    console.log("PostgreSQL connection closed.");
  }

  process.exit(0);
});
