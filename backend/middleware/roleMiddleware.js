/**
 * Role-based Authorization Middleware
 * Kiểm tra quyền người dùng (admin, customer)
 */

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    try {
      // req.user phải được set bởi authMiddleware
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User not authenticated',
        });
      }

      // Kiểm tra vai trò
      if (!allowedRoles.includes(req.user.vai_tro)) {
        return res.status(403).json({
          success: false,
          message: 'You do not have permission to access this resource',
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Authorization error',
      });
    }
  };
};

module.exports = roleMiddleware;
