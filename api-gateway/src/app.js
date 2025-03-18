const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const config = require("./config/config");

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan("combined")); // Request logging
app.use(express.json()); // Parse JSON bodies

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    status: 429,
    message: "Too many requests, please try again later.",
  },
});
app.use(limiter);

// Routes
app.use("/", routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log("Available routes:");
  console.log("- /api/books/*");
  console.log("- /api/customers/*");
  console.log("- /api/orders/*");
  console.log("- /api/auth/*");
  console.log("- /health");
});

module.exports = app;
