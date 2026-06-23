const express = require('express');
const router = express.Router();
const { aiChat, generateIdeas, seoSuggestions, generateProposal } = require('../controllers/aiController');
const authMiddleware = require('../middleware/authMiddleware');

// Public route for qualifying chatbot
router.post('/chat', aiChat);

// Admin routes (JWT protected)
router.post('/generate-ideas', authMiddleware, generateIdeas);
router.post('/seo-suggestions', authMiddleware, seoSuggestions);
router.get('/generate-proposal/:inquiryId', authMiddleware, generateProposal);

module.exports = router;
