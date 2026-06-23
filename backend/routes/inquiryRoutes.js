const express = require('express');
const { body } = require('express-validator');
const inquiryController = require('../controllers/inquiryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public route - Create inquiry
router.post(
  '/',
  [
    body('clientName').trim().notEmpty().withMessage('Client name is required').isLength({ min: 2 }),
    body('businessName').trim().notEmpty().withMessage('Business name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('websiteType').notEmpty().withMessage('Website type is required'),
    body('requirements')
      .trim()
      .isLength({ min: 20 })
      .withMessage('Requirements must be at least 20 characters'),
    body('budget').notEmpty().withMessage('Budget is required'),
    body('deadline').notEmpty().withMessage('Deadline is required'),
  ],
  inquiryController.createInquiry
);

// Private routes - Require admin authentication
router.get('/', authMiddleware, inquiryController.getAllInquiries);
router.get('/:id', authMiddleware, inquiryController.getSingleInquiry);
router.patch('/:id', authMiddleware, inquiryController.updateInquiryStatus);
router.delete('/:id', authMiddleware, inquiryController.deleteInquiry);

module.exports = router;
