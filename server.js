
const express = require("express");
const mongoose = require("mongoose");
const connectDatabase = require("./database");
const hackRoutes = require("./routes/routes"); // Import the routes from routes.js

const app = express();

// Connect to the database
connectDatabase();

// Middleware for parsing JSON requests
app.use(express.json());  // Make sure to use express.json to handle POST and PUT body data

// Ping route (testing)
app.get("/ping", (req, res) => {
  try {
    res.send("pong");
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

// **Home Route with DB Status**
app.get("/", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "Connected" : "Not Connected";
  res.json({ message: "Welcome to the API", db_status: status });
});

// Use the routes defined in routes.js
app.use("/api", hackRoutes);  // Prefix all hack routes with /api

// Start the server
app.listen(8000, () => {
  console.log(`Server is running on http://localhost:8000`);
});
