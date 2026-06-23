const express = require('express');
const { body } = require('express-validator');
const leadController = require('../controllers/leadController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public route - Create lead
router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone is required'),
    body('service').notEmpty().withMessage('Service is required'),
    body('budget').notEmpty().withMessage('Budget is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  leadController.createLead
);

// Private routes - Require admin authentication
router.get('/', authMiddleware, leadController.getAllLeads);
router.get('/:id', authMiddleware, leadController.getSingleLead);
router.patch('/:id', authMiddleware, leadController.updateLeadStatus);
router.delete('/:id', authMiddleware, leadController.deleteLead);

module.exports = router;
