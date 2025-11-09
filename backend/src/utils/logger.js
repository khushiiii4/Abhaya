const { createLogger, format, transports } = require("winston");
const { combine, timestamp, printf, colorize } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  format: combine(colorize(), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    // Print logs to console
    new transports.Console(),
    // Save errors to file
    new transports.File({ filename: "logs/error.log", level: "error" }),
    // Save all logs to file
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

module.exports = logger;
