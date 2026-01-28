/**
 * Booking Model
 * Lưu thông tin đặt tour của khách hàng
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID đặt tour',
  },
  nguoi_dung_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'nguoi_dung',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: 'ID người dùng',
  },
  tour_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'tour',
      key: 'id',
    },
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
    comment: 'ID tour',
  },
  so_luong_nguoi: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    comment: 'Số lượng người đặt',
  },
  so_tien_tong: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Tổng tiền đặt tour',
  },
  trang_thai: {
    type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
    defaultValue: 'pending',
    comment: 'Trạng thái đặt tour: pending (chờ thanh toán), confirmed (đã xác nhận), completed (hoàn thành), cancelled (hủy)',
  },
  ghi_chu: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: 'Ghi chú thêm',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Ngày tạo booking',
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    comment: 'Ngày cập nhật',
  },
}, {
  tableName: 'dat_tour',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    { fields: ['nguoi_dung_id'] },
    { fields: ['tour_id'] },
    { fields: ['trang_thai'] },
    { fields: ['created_at'] },
    {
      name: 'idx_user_tour',
      fields: ['nguoi_dung_id', 'tour_id'],
    },
  ],
});

module.exports = Booking;
