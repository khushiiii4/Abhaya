const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const logger = require("./utils/logger");
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Create HTTP server manually to attach socket.io
const server = http.createServer(app);

// Attach Socket.IO
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",  // frontend will replace * with real URL later
    methods: ["GET", "POST"]
  }
});

// Attach io to app so controllers can access it
app.set("io", io);

// Load socket service
require("./services/socketService")(io);

server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});
