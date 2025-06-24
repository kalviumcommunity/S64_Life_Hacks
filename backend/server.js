const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDatabase = require("./database"); // MongoDB connection
const { sequelize, connectPostgres } = require("./postgresDatabase"); // PostgreSQL connection
const hackRoutes = require("./routes/routes"); // MongoDB routes
const hackRoutesSQL = require("./routes/routesSQL"); // PostgreSQL routes
const authRoutes = require("./routes/authRoutes"); // PostgreSQL auth routes
const mongoAuthRoutes = require("./routes/mongoAuthRoutes"); // MongoDB auth routes

dotenv.config();  // Load environment variables

const app = express();

// Enable CORS for secure authentication
const allowedOrigins = [
  "http://localhost:3000",  // Create React App default port
  "http://localhost:5173",  // Vite default port
  "https://quiet-biscochitos-8c51cd.netlify.app"  // Production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For development, allow any localhost origin
    if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
      return callback(null, true);
    }
    
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true
}));

// Middleware for parsing JSON requests and handling cookies
app.use(express.json());
app.use(cookieParser());

// Connect to MongoDB
connectDatabase();

// Connect to PostgreSQL
connectPostgres();

// Ping route (testing)
app.get("/ping", (req, res) => res.send("pong"));

// Home Route with DB Status
app.get("/", async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? "Connected to MongoDB" : "Not Connected to MongoDB";
  try {
    await sequelize.authenticate();
    res.json({ message: "Welcome to the API", mongo_status: mongoStatus, postgres_status: "Connected to PostgreSQL" });
  } catch (error) {
    res.json({ message: "Welcome to the API", mongo_status: mongoStatus, postgres_status: "Not Connected to PostgreSQL" });
  }
});

// Authentication Routes
app.use("/auth", authRoutes); // PostgreSQL auth
app.use("/api/mongo/auth", mongoAuthRoutes); // MongoDB auth

// MongoDB Hack Routes
app.use("/api/mongo", hackRoutes);

// PostgreSQL Hack Routes
app.use("/api/postgres", hackRoutesSQL);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed.");

  if (sequelize) {
    await sequelize.close();
    console.log("✅ PostgreSQL connection closed.");
  }

  process.exit(0);
});
