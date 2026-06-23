const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject, deleteProjectImage, deleteProjectVideo } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getProjects);
router.get('/:id', getProject);

// Admin routes
router.post('/', authMiddleware, upload.array('images', 10), createProject);
router.put('/:id', authMiddleware, upload.array('images', 10), updateProject);
router.delete('/:id', authMiddleware, deleteProject);
router.delete('/:id/images/:imageIndex', authMiddleware, deleteProjectImage);
router.delete('/:id/videos/:videoIndex', authMiddleware, deleteProjectVideo);

module.exports = router;
