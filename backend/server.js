require("dotenv").config();
const path = require("path");
const app = require("./config/app");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
const express = require("express");
const creatorRoutes = require("./routes/creatorRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const meetingRoutes = require("./routes/meetings");
const cors = require("cors");
const videoRoutes = require("./routes/VideoRoute");

const PORT = process.env.PORT || 10000;

// Connect to database
connectDB();

// CORS Configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://emotion-builder.vercel.app',
    'https://emotion-builder.onrender.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Favicon handling
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Emotion Builder API is running",
    documentation: "https://your-docs-url.com"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.use("/api/creators", creatorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meetings", meetingRoutes);
app.use('/api/videos', videoRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ping endpoint
app.get("/ping", (req, res) => {
  res.send("Backend is working!");
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});