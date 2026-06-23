const express = require('express');
const router = express.Router();
const { getServices, getService, createService, updateService, deleteService } = require('../controllers/serviceController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getServices);
router.get('/:id', getService);

// Admin routes
router.post('/', authMiddleware, upload.single('image'), createService);
router.put('/:id', authMiddleware, upload.single('image'), updateService);
router.delete('/:id', authMiddleware, deleteService);

module.exports = router;
