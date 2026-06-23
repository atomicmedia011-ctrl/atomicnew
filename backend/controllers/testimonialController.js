const Testimonial = require('../models/Testimonial');
const cloudinary = require('../config/cloudinary');

// @desc    Get all testimonials
// @route   GET /api/testimonials
exports.getTestimonials = async (req, res, next) => {
  try {
    const { status, featured } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (featured) filter.featured = featured === 'true';

    const testimonials = await Testimonial.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: testimonials, total: testimonials.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
exports.getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Create testimonial
// @route   POST /api/testimonials
exports.createTestimonial = async (req, res, next) => {
  try {
    const { name, role, company, content, rating, featured, status, order } = req.body;
    const data = { name, role, company, content, rating, featured, status, order };

    if (req.file) {
      data.avatar = { url: req.file.path, publicId: req.file.filename };
    }

    const testimonial = await Testimonial.create(data);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
exports.updateTestimonial = async (req, res, next) => {
  try {
    let testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });

    const updateData = { ...req.body };

    if (req.file) {
      if (testimonial.avatar && testimonial.avatar.publicId) {
        try { await cloudinary.uploader.destroy(testimonial.avatar.publicId); } catch (e) { /* ignore */ }
      }
      updateData.avatar = { url: req.file.path, publicId: req.file.filename };
    }

    testimonial = await Testimonial.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ error: 'Testimonial not found' });

    if (testimonial.avatar && testimonial.avatar.publicId) {
      try { await cloudinary.uploader.destroy(testimonial.avatar.publicId); } catch (e) { /* ignore */ }
    }

    await Testimonial.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};
