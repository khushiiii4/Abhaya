const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contacts", contactRoutes);

const testRoutes = require("./routes/testRoutes");
app.use("/api/test", testRoutes);

const sosRoutes = require("./routes/sosRoutes");
app.use("/api/sos", sosRoutes);

const zoneRoutes = require("./routes/zoneRoutes");
app.use("/api/zones", zoneRoutes);

const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

const { errorHandler } = require("./middleware/errorMiddleware");
app.use(errorHandler);

app.get("/", (req, res) => res.send("SafeHer Backend Running ✅"));

module.exports = app;
