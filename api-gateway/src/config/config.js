require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  accessToken: process.env.ACCESS_TOKEN,
  refreshToken: process.env.REFRESH_TOKEN,
  services: {
    books: process.env.BOOKS_SERVICE_URL,
    customers: process.env.CUSTOMERS_SERVICE_URL,
    orders: process.env.ORDERS_SERVICE_URL,
    auth: process.env.AUTH_SERVICE_URL,
  },
  rateLimit: {
    windowMs: eval(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
};
