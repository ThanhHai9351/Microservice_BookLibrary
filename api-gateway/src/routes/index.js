const express = require("express");
const { createServiceProxy } = require("../middleware/proxy");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date() });
});

// Books service routes
router.use(
  "/api/books",
  // authenticateToken,
  createServiceProxy("books")
);

// Customers service routes
router.use(
  "/api/customers",
  // authenticateToken,
  createServiceProxy("customers")
);

// Orders service routes
router.use(
  "/api/orders",
  // authenticateToken,
  createServiceProxy("orders")
);

module.exports = router;
