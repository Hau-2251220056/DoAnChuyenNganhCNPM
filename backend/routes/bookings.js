/**
 * Booking Routes
 */

const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Customer routes
router.post('/', authMiddleware, bookingController.createBooking);
router.get('/', authMiddleware, bookingController.getMyBookings);
router.post('/:id/confirm-payment', authMiddleware, bookingController.confirmPaymentBooking);
router.get('/:id', authMiddleware, bookingController.getBookingById);
router.put('/:id', authMiddleware, bookingController.cancelBooking);

// Admin routes
router.get('/admin/all', authMiddleware, roleMiddleware(['admin']), bookingController.getAllBookings);
router.put('/admin/:id', authMiddleware, roleMiddleware(['admin']), bookingController.updateBookingStatus);

module.exports = router;
