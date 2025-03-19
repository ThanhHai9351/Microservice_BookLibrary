const winston = require("winston");
const path = require("path");

const timeFormat = () => {
  return new Date().toISOString();
};

// Tạo logger instance
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level}]: ${message}`;
    })
  ),
  transports: [
    // Ghi log thông thường vào file
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/app.log"),
      level: "info",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Ghi log lỗi vào file riêng
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Hiển thị log ra console khi dev
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      level: "debug",
    }),
  ],
});

module.exports = logger;
