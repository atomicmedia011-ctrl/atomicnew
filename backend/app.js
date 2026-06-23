const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env or the current directory
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/authRoutes');
const leadRoutes = require('./routes/leadRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const projectRoutes = require('./routes/projectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const teamRoutes = require('./routes/teamRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const otpRoutes = require('./routes/otpRoutes');
const aiRoutes = require('./routes/aiRoutes');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const seedData = require('./utils/seeder');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Ensure DB is connected before handling any requests (crucial for Serverless Vercel deployment)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }
  try {
    await connectDB();
    await seedData();
    next();
  } catch (err) {
    next(err);
  }
});


// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
    credentials: true,
  })
);

// Serve frontend static files
const frontendPath = path.join(__dirname, '../breakable-works-007788.framer.app');
app.use(express.static(frontendPath));

// Serve admin panel
const adminPath = path.join(__dirname, '../admin');
app.use('/admin', express.static(adminPath));

// Admin panel SPA fallback
app.get('/admin', (req, res) => {
  res.sendFile(path.join(adminPath, 'index.html'));
});

// Legal pages
app.get('/terms', (req, res) => {
  res.sendFile(path.join(frontendPath, 'terms', 'index.html'));
});
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(frontendPath, 'privacy-policy', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running ✓', timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/ai', aiRoutes);

// SPA fallback for frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Error handling
app.use(errorMiddleware);

module.exports = app;
