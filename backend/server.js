require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { initializeGemini } = require("./config/gemini");
const errorHandler = require("./middleware/errorHandler");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Initialize Express app
const app = express();

// Connect to database
connectDB();

// Initialize Gemini AI
initializeGemini();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);

// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Invoice Generator API is running",
        timestamp: new Date().toISOString(),
    });
});

// Root route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to Invoice Generator API",
        version: "1.0.0",
    });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
