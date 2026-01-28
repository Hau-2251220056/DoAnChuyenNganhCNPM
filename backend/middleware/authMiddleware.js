/**
 * Authentication Middleware
 * Xác thực JWT token từ header Authorization
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid authorization token',
      });
    }

    const token = authHeader.substring(7); // Bỏ "Bearer "

    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    
    // Lưu thông tin user vào request object
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
};

module.exports = authMiddleware;
