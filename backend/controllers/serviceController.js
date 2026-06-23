const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary');

// @desc    Get all services
// @route   GET /api/services
exports.getServices = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const services = await Service.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: services, total: services.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service
// @route   GET /api/services/:id
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Create service
// @route   POST /api/services
exports.createService = async (req, res, next) => {
  try {
    const { title, description, shortDescription, icon, features, status, order } = req.body;
    const serviceData = { title, description, shortDescription, icon, status, order };

    if (features) {
      serviceData.features = typeof features === 'string' ? features.split(',').map(f => f.trim()) : features;
    }

    if (req.file) {
      serviceData.image = { url: req.file.path, publicId: req.file.filename };
    }

    const service = await Service.create(serviceData);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Update service
// @route   PUT /api/services/:id
exports.updateService = async (req, res, next) => {
  try {
    let service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    const updateData = { ...req.body };
    if (updateData.features && typeof updateData.features === 'string') {
      updateData.features = updateData.features.split(',').map(f => f.trim());
    }

    if (req.file) {
      if (service.image && service.image.publicId) {
        try { await cloudinary.uploader.destroy(service.image.publicId); } catch (e) { /* ignore */ }
      }
      updateData.image = { url: req.file.path, publicId: req.file.filename };
    }

    service = await Service.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });

    if (service.image && service.image.publicId) {
      try { await cloudinary.uploader.destroy(service.image.publicId); } catch (e) { /* ignore */ }
    }

    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (error) {
    next(error);
  }
};
