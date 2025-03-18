require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET,
  services: {
    books: process.env.BOOKS_SERVICE_URL,
    customers: process.env.CUSTOMERS_SERVICE_URL,
    orders: process.env.ORDERS_SERVICE_URL,
  },
  rateLimit: {
    windowMs: eval(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
};
