const logger = require("../utils/logger");

module.exports = (io) => {

  io.on("connection", (socket) => {
    logger.info(`🟢 User connected: ${socket.id}`);

    // user joins personal room
    socket.on("join", (userId) => {
      socket.join(userId);
      logger.info(`User ${userId} joined room ${userId}`);
    });

    // SOS triggered event → broadcast to connected contacts (global for now)
    socket.on("sos:triggered", (data) => {
      logger.info(`SOS triggered by user ${data.userId}`);

      // Broadcast alert to all
      io.emit("sos:alert", {
        userId: data.userId,
        lat: data.lat,
        lng: data.lng,
        message: "SOS Triggered!"
      });
    });

    // SOS resolved event
    socket.on("sos:resolve", (data) => {
      logger.info(`SOS resolved by ${data.userId}`);
      io.emit("sos:resolved", data);
    });

    socket.on("disconnect", () => {
      logger.info(`🔴 User disconnected: ${socket.id}`);
    });
  });
};
