/**
 * Payment Controller
 * Xử lý thanh toán PayPal
 */

const axios = require('axios');
const sequelize = require('../config/database');
const { Booking, Payment, Tour } = require('../models');
const paypalConfig = require('../config/paypal');

/**
 * Lấy PayPal access token
 */
const getPayPalAccessToken = async () => {
  try {
    const config = paypalConfig[paypalConfig.mode];
    const auth = Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64');

    const response = await axios.post(
      `${config.baseUrl}/v1/oauth2/token`,
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    throw new Error('Failed to get PayPal access token');
  }
};

/**
 * POST /payments
 * Tạo order PayPal
 * Body: booking_id
 */
exports.createPayment = async (req, res, next) => {
  try {
    const { booking_id } = req.body;
    const nguoi_dung_id = req.user.id;

    if (!booking_id) {
      return res.status(400).json({
        success: false,
        message: 'booking_id is required',
      });
    }

    // Lấy booking
    const booking = await Booking.findOne({
      where: {
        id: booking_id,
        nguoi_dung_id,
      },
      include: {
        model: Tour,
        as: 'tour',
      },
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (booking.trang_thai !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending bookings can be paid',
      });
    }

    // Lấy access token
    const accessToken = await getPayPalAccessToken();
    const config = paypalConfig[paypalConfig.mode];

    // Tạo PayPal order
    const paypalResponse = await axios.post(
      `${config.baseUrl}/v2/checkout/orders`,
      {
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: `booking_${booking_id}`,
            amount: {
              currency_code: 'USD',
              value: (booking.so_tien_tong / 24500).toFixed(2), // Quy đổi VND -> USD (tỷ giá 24500)
            },
            description: `Tour: ${booking.tour.ten_tour} - ${booking.so_luong_nguoi} người`,
          },
        ],
        application_context: {
          return_url: config.returnUrl,
          cancel_url: config.cancelUrl,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Lưu payment record
    const payment = await Payment.create({
      nguoi_dung_id,
      dat_tour_id: booking_id,
      paypal_order_id: paypalResponse.data.id,
      so_tien: booking.so_tien_tong,
      trang_thai: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Payment order created successfully',
      data: {
        payment_id: payment.id,
        paypal_order_id: paypalResponse.data.id,
        approval_url: paypalResponse.data.links.find((link) => link.rel === 'approve')?.href,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /payments/success
 * Callback thanh toán thành công từ PayPal
 * Query: token (PayPal order ID)
 */
exports.paymentSuccess = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'PayPal order token is required',
      });
    }

    // Lấy access token
    const accessToken = await getPayPalAccessToken();
    const config = paypalConfig[paypalConfig.mode];

    // Capture payment từ PayPal
    const captureResponse = await axios.post(
      `${config.baseUrl}/v2/checkout/orders/${token}/capture`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (captureResponse.data.status !== 'COMPLETED') {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Payment capture failed',
      });
    }

    // Cập nhật payment record
    const payment = await Payment.findOne({
      where: { paypal_order_id: token },
      lock: true,
      transaction,
    });

    if (!payment) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: 'Payment record not found',
      });
    }

    payment.trang_thai = 'completed';
    payment.thoi_gian_thanh_toan = new Date();
    await payment.save({ transaction });

    // Cập nhật booking
    const booking = await Booking.findByPk(payment.dat_tour_id, {
      lock: true,
      transaction,
    });

    booking.trang_thai = 'confirmed';
    await booking.save({ transaction });

    await transaction.commit();

    // Trả về thông tin cho frontend
    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        booking_id: booking.id,
        payment_id: payment.id,
        amount: payment.so_tien,
        status: payment.trang_thai,
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Payment success error:', error.message);
    next(error);
  }
};

/**
 * GET /payments/cancel
 * Callback khi thanh toán bị hủy
 */
exports.paymentCancel = async (req, res, next) => {
  try {
    const { token } = req.query;

    // Cập nhật payment record thành cancelled
    const payment = await Payment.findOne({
      where: { paypal_order_id: token },
    });

    if (payment) {
      payment.trang_thai = 'cancelled';
      await payment.save();
    }

    res.status(200).json({
      success: true,
      message: 'Payment cancelled',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /payments
 * Lịch sử thanh toán của người dùng
 */
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const nguoi_dung_id = req.user.id;

    const payments = await Payment.findAll({
      where: { nguoi_dung_id },
      include: {
        model: Booking,
        as: 'booking',
        attributes: ['id', 'tour_id', 'so_luong_nguoi'],
        include: {
          model: Tour,
          as: 'tour',
          attributes: ['id', 'ten_tour', 'dia_diem'],
        },
      },
      order: [['created_at', 'DESC']],
    });

    res.status(200).json({
      success: true,
      message: 'Payment history retrieved successfully',
      data: payments,
      count: payments.length,
    });
  } catch (error) {
    next(error);
  }
};
