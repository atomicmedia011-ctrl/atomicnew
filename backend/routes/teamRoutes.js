const express = require('express');
const router = express.Router();
const { getTeamMembers, getTeamMember, createTeamMember, updateTeamMember, deleteTeamMember } = require('../controllers/teamController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public routes
router.get('/', getTeamMembers);
router.get('/:id', getTeamMember);

// Admin routes
router.post('/', authMiddleware, upload.single('avatar'), createTeamMember);
router.put('/:id', authMiddleware, upload.single('avatar'), updateTeamMember);
router.delete('/:id', authMiddleware, deleteTeamMember);

module.exports = router;
