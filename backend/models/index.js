/**
 * Models Index
 * Khởi tạo các models và quan hệ giữa chúng
 */

const User = require('./User');
const Tour = require('./Tour');
const Booking = require('./Booking');
const Payment = require('./Payment');

// ============== Thiết lập quan hệ ==============

// User 1-N Booking (một người dùng có nhiều booking)
User.hasMany(Booking, {
  foreignKey: 'nguoi_dung_id',
  as: 'bookings',
  onDelete: 'CASCADE',
});
Booking.belongsTo(User, {
  foreignKey: 'nguoi_dung_id',
  as: 'user',
});

// Tour 1-N Booking (một tour có nhiều booking)
Tour.hasMany(Booking, {
  foreignKey: 'tour_id',
  as: 'bookings',
  onDelete: 'RESTRICT',
});
Booking.belongsTo(Tour, {
  foreignKey: 'tour_id',
  as: 'tour',
});

// Booking 1-N Payment (một booking có nhiều payment attempts)
Booking.hasMany(Payment, {
  foreignKey: 'dat_tour_id',
  as: 'payments',
  onDelete: 'CASCADE',
});
Payment.belongsTo(Booking, {
  foreignKey: 'dat_tour_id',
  as: 'booking',
});

// User 1-N Payment (một người dùng có nhiều payment)
User.hasMany(Payment, {
  foreignKey: 'nguoi_dung_id',
  as: 'payments',
  onDelete: 'CASCADE',
});
Payment.belongsTo(User, {
  foreignKey: 'nguoi_dung_id',
  as: 'user',
});

module.exports = {
  User,
  Tour,
  Booking,
  Payment,
};
