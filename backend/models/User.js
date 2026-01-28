/**
 * User Model
 * Lưu thông tin người dùng: khách hàng và admin
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID người dùng',
  },
  ho_ten: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Họ tên đầy đủ',
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
    comment: 'Email đăng nhập',
  },
  mat_khau: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Mật khẩu (bcrypt hash)',
  },
  so_dien_thoai: {
    type: DataTypes.STRING(20),
    allowNull: true,
    comment: 'Số điện thoại liên hệ',
  },
  dia_chi: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Địa chỉ nhận hàng',
  },
  vai_tro: {
    type: DataTypes.ENUM('khach_hang', 'admin'),
    defaultValue: 'khach_hang',
    comment: 'Vai trò: khách hàng hoặc admin',
  },
  trang_thai: {
    type: DataTypes.ENUM('active', 'inactive', 'blocked'),
    defaultValue: 'active',
    comment: 'Trạng thái tài khoản',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Ngày tạo',
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    comment: 'Ngày cập nhật',
  },
}, {
  tableName: 'nguoi_dung',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    { fields: ['email'], unique: true },
    { fields: ['vai_tro'] },
    { fields: ['trang_thai'] },
  ],
});

// Hooks: Hash mật khẩu trước khi lưu
User.beforeCreate(async (user) => {
  const salt = await bcrypt.genSalt(10);
  user.mat_khau = await bcrypt.hash(user.mat_khau, salt);
});

User.beforeUpdate(async (user) => {
  if (user.changed('mat_khau')) {
    const salt = await bcrypt.genSalt(10);
    user.mat_khau = await bcrypt.hash(user.mat_khau, salt);
  }
});

// Method: So sánh mật khẩu
User.prototype.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.mat_khau);
};

module.exports = User;
