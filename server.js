
const express = require("express");
const mongoose = require("mongoose");
const connectDatabase = require("./database");

const app = express();
connectDatabase();

app.get("/ping", (req, res) => {
  try {
    res.send("pong");
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

// **Add Home Route with DB Status**
app.get("/", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "Connected" : "Not Connected";
  res.json({ message: "Welcome to the API", db_status: status });
});

app.listen(8000, () => {
  console.log(`Server is running on port http://localhost:8000`);
});
