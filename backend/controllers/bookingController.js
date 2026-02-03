/**
 * Booking Controller
 * Xử lý đặt tour, lịch sử booking, quản lý booking (admin)
 */

const { Op } = require('sequelize');
const sequelize = require('../config/database');
const { Booking, Tour, User } = require('../models');

/**
 * POST /bookings
 * Tạo booking mới
 * Body: tour_id, so_luong_nguoi, ghi_chu
 */
exports.createBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { tour_id, so_luong_nguoi, ghi_chu } = req.body;
    const nguoi_dung_id = req.user.id;

    // Validate
    if (!tour_id || !so_luong_nguoi) {
      return res.status(400).json({
        success: false,
        message: 'tour_id and so_luong_nguoi are required',
      });
    }

    // Lấy thông tin tour (lock để tránh race condition)
    const tour = await Tour.findByPk(tour_id, {
      lock: true,
      transaction,
    });

    if (!tour) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Tour not found',
      });
    }

    // Kiểm tra số chỗ còn lại
    if (tour.so_cho_con_lai < so_luong_nguoi) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Not enough available seats. Available: ${tour.so_cho_con_lai}`,
      });
    }

    // Tính tổng tiền
    const so_tien_tong = tour.gia_tien * so_luong_nguoi;

    // Tạo booking
    const booking = await Booking.create(
      {
        nguoi_dung_id,
        tour_id,
        so_luong_nguoi: parseInt(so_luong_nguoi),
        so_tien_tong,
        ghi_chu,
        trang_thai: 'pending', // Chờ thanh toán
      },
      { transaction }
    );

    // Cập nhật số chỗ còn lại
    tour.so_cho_con_lai -= so_luong_nguoi;
    await tour.save({ transaction });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: {
        id: booking.id,
        tour_id: booking.tour_id,
        so_luong_nguoi: booking.so_luong_nguoi,
        so_tien_tong: booking.so_tien_tong,
        trang_thai: booking.trang_thai,
      },
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * GET /bookings
 * Danh sách booking của người dùng hiện tại
 */
exports.getMyBookings = async (req, res, next) => {
  try {
    const nguoi_dung_id = req.user.id;

    const bookings = await Booking.findAll({
      where: { nguoi_dung_id },
      include: [
        {
          model: Tour,
          as: 'tour',
          attributes: ['id', 'ten_tour', 'dia_diem', 'gia_tien', 'ngay_khoi_hanh'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Bookings retrieved successfully',
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /bookings/:id
 * Chi tiết booking
 */
exports.getBookingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const nguoi_dung_id = req.user.id;

    const booking = await Booking.findOne({
      where: {
        id,
        nguoi_dung_id, // Chỉ lấy booking của chính người dùng
      },
      include: [
        {
          model: Tour,
          as: 'tour',
        },
      ],
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /bookings/:id
 * Hủy booking (customer)
 */
exports.cancelBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const nguoi_dung_id = req.user.id;

    const booking = await Booking.findOne({
      where: { id, nguoi_dung_id },
      lock: true,
      transaction,
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Chỉ có thể hủy booking ở trạng thái pending hoặc confirmed
    if (!['pending', 'confirmed'].includes(booking.trang_thai)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot cancel booking with status: ${booking.trang_thai}`,
      });
    }

    // Cập nhật trạng thái
    booking.trang_thai = 'cancelled';
    await booking.save({ transaction });

    // Trả lại số chỗ cho tour
    const tour = await Tour.findByPk(booking.tour_id, { transaction });
    tour.so_cho_con_lai += booking.so_luong_nguoi;
    await tour.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

/**
 * GET /admin/bookings
 * Danh sách tất cả booking (Admin only)
 */
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, tour_id } = req.query;

    const where = {};
    if (status) where.trang_thai = status;
    if (tour_id) where.tour_id = tour_id;

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'ho_ten', 'email', 'so_dien_thoai'],
        },
        {
          model: Tour,
          as: 'tour',
          attributes: ['id', 'ten_tour', 'dia_diem', 'ngay_khoi_hanh'],
        },
      ],
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'All bookings retrieved successfully',
      data: bookings,
      count: bookings.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /admin/bookings/:id
 * Xác nhận hoặc hủy booking (Admin only)
 * Body: action (confirm, reject)
 */
exports.updateBookingStatus = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const { action } = req.body;

    if (!['confirm', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be confirm or reject',
      });
    }

    const booking = await Booking.findByPk(id, {
      lock: true,
      transaction,
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (action === 'confirm') {
      booking.trang_thai = 'confirmed';
    } else if (action === 'reject') {
      booking.trang_thai = 'cancelled';

      // Trả lại số chỗ
      const tour = await Tour.findByPk(booking.tour_id, { transaction });
      tour.so_cho_con_lai += booking.so_luong_nguoi;
      await tour.save({ transaction });
    }

    await booking.save({ transaction });
    await transaction.commit();

    res.status(200).json({
      success: true,
      message: `Booking ${action}ed successfully`,
      data: booking,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};
/**
 * POST /bookings/:id/confirm-payment
 * Xác nhận thanh toán và cập nhật booking status (after payment success)
 */
exports.confirmPaymentBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const nguoi_dung_id = req.user.id;

    const booking = await Booking.findOne({
      where: { id, nguoi_dung_id },
      lock: true,
      transaction,
    });

    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Chỉ có thể confirm nếu ở trạng thái pending hoặc pending_payment
    if (!['pending', 'pending_payment'].includes(booking.trang_thai)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: `Cannot confirm payment for booking with status: ${booking.trang_thai}`,
      });
    }

    // Cập nhật trạng thái thành confirmed
    booking.trang_thai = 'confirmed';
    await booking.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Payment confirmed successfully',
      data: booking,
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};