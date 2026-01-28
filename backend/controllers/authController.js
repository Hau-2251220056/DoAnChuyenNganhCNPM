/**
 * Authentication Controller
 * Xử lý đăng ký, đăng nhập
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Tạo JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      vai_tro: user.vai_tro,
    },
    process.env.JWT_SECRET || 'your-secret-key-change-this',
    {
      expiresIn: process.env.JWT_EXPIRATION || '7d',
    }
  );
};

/**
 * POST /auth/register
 * Đăng ký tài khoản mới
 */
exports.register = async (req, res, next) => {
  try {
    const { email, password, ho_ten, so_dien_thoai } = req.body;

    // Validate input
    if (!email || !password || !ho_ten) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and ho_ten are required',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Kiểm tra email tồn tại
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    // Tạo user mới (vai trò mặc định: khách hàng)
    const user = await User.create({
      email,
      mat_khau: password,
      ho_ten,
      so_dien_thoai,
      vai_tro: 'khach_hang',
      trang_thai: 'active',
    });

    // Tạo token
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        vai_tro: user.vai_tro,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/login
 * Đăng nhập
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Tìm user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Kiểm tra tài khoản bị khóa
    if (user.trang_thai === 'blocked') {
      return res.status(403).json({
        success: false,
        message: 'Account is blocked',
      });
    }

    // So sánh password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Tạo token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        email: user.email,
        ho_ten: user.ho_ten,
        vai_tro: user.vai_tro,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /auth/profile
 * Lấy thông tin profile người dùng
 */
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['mat_khau'],
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
