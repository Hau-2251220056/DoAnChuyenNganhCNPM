/**
 * Global Error Handler Middleware
 * Xử lý lỗi tập trung cho toàn ứng dụng
 */

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  // Lỗi Validation Sequelize
  if (err.name === 'SequelizeValidationError') {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: messages,
    });
  }

  // Lỗi Unique Constraint
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path;
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  // Lỗi Foreign Key
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid reference to related record',
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
