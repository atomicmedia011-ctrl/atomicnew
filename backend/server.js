const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env or the current directory
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const dns = require('dns');

// Global DNS server configurations removed to ensure standard system lookups are not broken.


const app = require('./app');
const connectDB = require('./config/db');
const seedData = require('./utils/seeder');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Seed default projects/services if empty
    await seedData();

    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════╗
║       Atomic Media Server Started            ║
║       Port: ${PORT}                              ║
║       Frontend: http://localhost:${PORT}        ║
║       Admin:    http://localhost:${PORT}/admin   ║
║       API:      http://localhost:${PORT}/api     ║
╚══════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error(`✗ Server failed to start: Database connection could not be established.`);
    process.exit(1);
  }
};

startServer();
