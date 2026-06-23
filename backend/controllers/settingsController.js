const SiteSettings = require('../models/SiteSettings');
const cloudinary = require('../config/cloudinary');

// @desc    Get site settings
// @route   GET /api/settings
exports.getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ siteName: 'Atomic Media' });
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// @desc    Update site settings
// @route   PUT /api/settings
exports.updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ siteName: 'Atomic Media' });
    }

    const updateData = { ...req.body };

    // Parse JSON strings if sent as form data
    if (updateData.socialLinks && typeof updateData.socialLinks === 'string') {
      updateData.socialLinks = JSON.parse(updateData.socialLinks);
    }
    if (updateData.seo && typeof updateData.seo === 'string') {
      updateData.seo = JSON.parse(updateData.seo);
    }
    if (updateData.footer && typeof updateData.footer === 'string') {
      updateData.footer = JSON.parse(updateData.footer);
    }

    // Handle logo upload
    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        if (settings.logo && settings.logo.publicId) {
          try { await cloudinary.uploader.destroy(settings.logo.publicId); } catch (e) { /* ignore */ }
        }
        updateData.logo = { url: req.files.logo[0].path, publicId: req.files.logo[0].filename };
      }
      if (req.files.favicon && req.files.favicon[0]) {
        if (settings.favicon && settings.favicon.publicId) {
          try { await cloudinary.uploader.destroy(settings.favicon.publicId); } catch (e) { /* ignore */ }
        }
        updateData.favicon = { url: req.files.favicon[0].path, publicId: req.files.favicon[0].filename };
      }
    }

    settings = await SiteSettings.findByIdAndUpdate(settings._id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};
