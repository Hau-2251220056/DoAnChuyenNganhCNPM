/**
 * Payment Routes
 */

const express = require('express');
const paymentController = require('../controllers/paymentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes - yêu cầu đăng nhập
router.post('/', authMiddleware, paymentController.createPayment);
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

// Callback routes (không cần auth vì gọi từ PayPal)
router.get('/success', paymentController.paymentSuccess);
router.get('/cancel', paymentController.paymentCancel);

module.exports = router;
