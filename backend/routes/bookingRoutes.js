const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route to book a meeting
router.post('/', createBooking);

// Admin routes (JWT protected)
router.get('/', authMiddleware, getAllBookings);
router.patch('/:id', authMiddleware, updateBookingStatus);
router.delete('/:id', authMiddleware, deleteBooking);

module.exports = router;
