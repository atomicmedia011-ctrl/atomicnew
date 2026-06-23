const express = require('express');
const router = express.Router();
const { getTestimonials, getTestimonial, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getTestimonials);
router.get('/:id', getTestimonial);

// Admin routes
router.post('/', authMiddleware, upload.single('avatar'), createTestimonial);
router.put('/:id', authMiddleware, upload.single('avatar'), updateTestimonial);
router.delete('/:id', authMiddleware, deleteTestimonial);

module.exports = router;
