/**
 * Tour Model
 * Lưu thông tin tour du lịch
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tour = sequelize.define('Tour', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID tour',
  },
  ten_tour: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Tên tour',
  },
  mo_ta: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Mô tả chi tiết tour',
  },
  dia_diem: {
    type: DataTypes.STRING(255),
    allowNull: false,
    comment: 'Địa điểm tour (tỉnh/thành phố)',
  },
  gia_tien: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Giá tour (VND)',
  },
  thoi_luong: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Thời lượng tour (ngày)',
  },
  ngay_khoi_hanh: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Ngày khởi hành cố định',
  },
  so_cho_tong: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    comment: 'Tổng số chỗ',
  },
  so_cho_con_lai: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30,
    comment: 'Số chỗ còn lại',
  },
  hinh_anh: {
    type: DataTypes.STRING(255),
    allowNull: true,
    comment: 'URL hình ảnh tour',
  },
  trang_thai: {
    type: DataTypes.ENUM('active', 'inactive', 'completed', 'cancelled'),
    defaultValue: 'active',
    comment: 'Trạng thái tour',
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
  tableName: 'tour',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    { fields: ['dia_diem'] },
    { fields: ['ngay_khoi_hanh'] },
    { fields: ['trang_thai'] },
    { fields: ['gia_tien'] },
  ],
});

module.exports = Tour;
