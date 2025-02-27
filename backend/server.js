const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDatabase = require("./database");
const hackRoutes = require("./routes/routes"); // Import the routes from routes.js

const app = express();

// Enable CORS
app.use(cors());

// Connect to the database
connectDatabase();

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

// **Home Route with DB Status**
app.get("/", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "Connected" : "Not Connected";
  res.json({ message: "Welcome to the API", db_status: status });
});

// Use the routes defined in routes.js
app.use("/api", hackRoutes); // Prefix all hack routes with /api

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
