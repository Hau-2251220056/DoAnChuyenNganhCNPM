/**
 * Tour Routes
 */

const express = require('express');
const tourController = require('../controllers/tourController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

// Public routes - lấy danh sách và chi tiết tour
router.get('/', tourController.getTours);
router.get('/:id', tourController.getTourById);

// Admin routes - quản lý tour
router.post('/', authMiddleware, roleMiddleware(['admin']), tourController.createTour);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), tourController.updateTour);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), tourController.deleteTour);

module.exports = router;
