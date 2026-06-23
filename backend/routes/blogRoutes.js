const express = require('express');
const router = express.Router();
const { getBlogs, getBlog, getBlogBySlug, createBlog, updateBlog, deleteBlog } = require('../controllers/blogController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlog);

// Admin routes
router.post('/', authMiddleware, upload.single('coverImage'), createBlog);
router.put('/:id', authMiddleware, upload.single('coverImage'), updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

module.exports = router;
