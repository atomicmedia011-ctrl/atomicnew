const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload a single image file
router.post('/image', upload.single('file'), uploadController.uploadImage);

// Delete an image by Cloudinary public_id
router.delete('/image', uploadController.deleteImage);

module.exports = router;
