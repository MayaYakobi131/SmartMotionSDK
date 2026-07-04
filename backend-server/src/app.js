const express = require("express");
const cors = require("cors");

// Initialize SQLite database
require("./services/database.service");

const healthRoutes = require("./routes/health.routes");
const locationRoutes = require("./routes/location.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", healthRoutes);
app.use("/api", locationRoutes);

module.exports = app;