const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const logger = require("./utils/logger");
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
