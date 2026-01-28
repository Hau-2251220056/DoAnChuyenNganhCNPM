/**
 * Payment Model
 * Lưu lịch sử thanh toán PayPal
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    comment: 'ID thanh toán',
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
  dat_tour_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'dat_tour',
      key: 'id',
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    comment: 'ID đặt tour',
  },
  paypal_order_id: {
    type: DataTypes.STRING(255),
    allowNull: true,
    unique: true,
    comment: 'PayPal Order ID',
  },
  so_tien: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    comment: 'Số tiền thanh toán (VND)',
  },
  trang_thai: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
    defaultValue: 'pending',
    comment: 'Trạng thái thanh toán',
  },
  thoi_gian_thanh_toan: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Thời gian thanh toán thành công',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    comment: 'Ngày tạo record',
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
    comment: 'Ngày cập nhật',
  },
}, {
  tableName: 'thanh_toan',
  timestamps: false,
  charset: 'utf8mb4',
  collate: 'utf8mb4_unicode_ci',
  indexes: [
    { fields: ['nguoi_dung_id'] },
    { fields: ['dat_tour_id'] },
    { fields: ['paypal_order_id'], unique: true },
    { fields: ['trang_thai'] },
    { fields: ['created_at'] },
  ],
});

module.exports = Payment;
