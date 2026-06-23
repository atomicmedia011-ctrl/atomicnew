require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import routes
const leadRoutes = require('./routes/leadRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Import middleware
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Connect to MongoDB
const startServer = async () => {
  await connectDB();

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS configuration
  app.use(
    cors({
      origin: [process.env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:5000'],
      credentials: true,
    })
  );

  // Serve frontend static files from the exported Framer build
  const frontendPath = path.join(__dirname, '../breakable-works-007788.framer.app');
  app.use(express.static(frontendPath));

  // Admin panel page
  app.get('/admin', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Panel</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #111; color: #fff; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
    main { max-width: 720px; padding: 32px; background: rgba(15, 15, 15, 0.95); border: 1px solid rgba(255,255,255,.08); border-radius: 24px; box-shadow: 0 24px 80px rgba(0,0,0,.35); }
    a { color: #70c0ff; text-decoration: none; }
    a:hover { text-decoration: underline; }
    h1 { margin-top: 0; }
    ul { margin: 16px 0 0; padding-left: 20px; }
    li { margin: 8px 0; }
  </style>
</head>
<body>
  <main>
    <h1>Admin Panel</h1>
    <p>This backend exposes admin APIs for auth, leads, and inquiries.</p>
    <ul>
      <li><a href="/api/auth/login">POST /api/auth/login</a> - Admin login</li>
      <li><a href="/api/auth/profile">GET /api/auth/profile</a> - Admin profile</li>
      <li><a href="/api/leads">GET /api/leads</a> - View leads (requires JWT)</li>
      <li><a href="/api/inquiries">GET /api/inquiries</a> - View inquiries (requires JWT)</li>
      <li><a href="/api/uploads/image">POST /api/uploads/image</a> - Upload image to Cloudinary (multipart/form-data; field name: file)</li>
      <li><a href="/api/health">GET /api/health</a> - Health check</li>
    </ul>
    <p>Use the admin login first to get a token, then include it in the <code>Authorization: Bearer &lt;token&gt;</code> header.</p>
  </main>
</body>
</html>`);
  });

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/leads', leadRoutes);
  app.use('/api/inquiries', inquiryRoutes);
  app.use('/api/ai', aiRoutes);
  app.use('/api/uploads', uploadRoutes);

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is running ✓' });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
  });

  // Error middleware (must be last)
  app.use(errorMiddleware);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   ATOMIC MEDIA Backend Server Started   ║
║   Port: ${PORT}                          ║
║   Environment: ${process.env.NODE_ENV}           ║
╚═══════════════════════════════════════╝
  `);
  });
};

startServer();

module.exports = app;
