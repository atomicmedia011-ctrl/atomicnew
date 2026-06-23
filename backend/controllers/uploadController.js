const { Readable } = require('stream');
const cloudinary = require('../config/cloudinary');

const uploadBufferToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: 'No file uploaded. Use form field "file".' });
    }

    const folder = req.body.folder || process.env.CLOUDINARY_UPLOAD_FOLDER || 'atomic_media';
    const result = await uploadBufferToCloudinary(req.file.buffer, folder);

    res.status(201).json({
      message: 'Image uploaded successfully',
      url: result.secure_url,
      public_id: result.public_id,
      folder: result.folder,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteImage = async (req, res, next) => {
  try {
    const publicId = req.body.public_id || req.query.public_id;
    if (!publicId) {
      return res.status(400).json({ error: 'public_id is required to delete an image.' });
    }

    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result !== 'ok' && result.result !== 'not found') {
      return res.status(500).json({ error: 'Failed to delete image from Cloudinary', details: result });
    }

    res.status(200).json({ message: 'Image deleted successfully', public_id: publicId, result: result.result });
  } catch (error) {
    next(error);
  }
};
