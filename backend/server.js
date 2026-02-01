/**
 * Main Server Entry Point
 * Backend API cho hệ thống đặt tour du lịch trực tuyến
 * 
 * Công nghệ:
 * - Express.js: Web framework
 * - Sequelize + MySQL: Database ORM
 * - JWT + bcrypt: Authentication & Security
 * - PayPal REST API: Payment processing
 * 
 * Chạy: npm start
 * Dev mode: npm run dev (với nodemon)
 * Seed data: npm run seed
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import config & utils
const { initializeDatabase } = require('./utils/db');
const { createDatabaseIfNotExists } = require('./utils/createDb');

// Import routes
const authRoutes = require('./routes/auth');
const tourRoutes = require('./routes/tours');
const bookingRoutes = require('./routes/bookings');
const paymentRoutes = require('./routes/payments');
const uploadRoutes = require('./routes/upload');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// ============== KHỞI TẠO EXPRESS ==============
const app = express();
const PORT = process.env.PORT || 5000;

// ============== MIDDLEWARE ==============

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Body parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Static files
app.use('/uploads', express.static('uploads'));

// Request logging (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ============== ROUTES ==============

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ============== ERROR HANDLER ==============
app.use(errorHandler);

// ============== KHỞI ĐỘNG SERVER ==============
const startServer = async () => {
  try {
    // Tạo database nếu chưa tồn tại
    console.log('🗄️ Checking database...');
    await createDatabaseIfNotExists();

    // Khởi tạo database
    console.log('📊 Initializing database...');
    await initializeDatabase();

    // Khởi động server
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════════════════════╗
║     🚀 Tour Booking Backend Server Started           ║
║     Port: ${PORT}                                        
║     Environment: ${process.env.NODE_ENV || 'development'}
║                                                      ║
║     📖 API Documentation:                            ║
║     Base URL: http://localhost:${PORT}/api/v1          ║
║                                                      ║
║     🔐 Auth: /auth/register, /auth/login             ║
║     🗽 Tours: GET /tours, /tours/:id                  ║
║     📅 Bookings: POST /bookings, GET /bookings        ║
║     💳 Payments: POST /payments, /payments/success   ║
║                                                      ║
║     💾 Admin Credentials:                            ║
║     Email: admin@tourbooking.com                     ║
║     Password: Admin@123456                           ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Start server
startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⛔ Server shutting down...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⛔ Server shutting down...');
  process.exit(0);
});

module.exports = app;
