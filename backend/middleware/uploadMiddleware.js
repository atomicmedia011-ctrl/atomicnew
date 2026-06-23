const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video');
    return {
      folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'atomicnew',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo 
        ? ['mp4', 'mov', 'avi', 'webm', 'mkv']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
      transformation: isVideo ? undefined : [{ quality: 'auto', fetch_format: 'auto' }],
    };
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

module.exports = upload;
