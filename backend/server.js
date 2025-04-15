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

const videoRoutes = require("./routes/VideoRoute"); // Fixed import (removed duplicate)

const PORT = process.env.PORT || 3000;

// Connect to database
connectDB();

const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://emotion-builder.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // add this if you're using cookies
};
app.use(cors(corsOptions));

// Adjust based on your file structure
app.use('/api', videoRoutes); // This ensures your routes are prefixed with /api

// Middleware Routes
app.use("/api/creators", creatorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/meetings", meetingRoutes);

// Serve uploaded videos statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/videos', videoRoutes);

app.get("/ping", (req, res) => {
  res.send("Backend is working!");
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
