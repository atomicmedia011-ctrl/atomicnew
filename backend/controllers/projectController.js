const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary');

// @desc    Get all projects (public)
// @route   GET /api/projects
exports.getProjects = async (req, res, next) => {
  try {
    const { status, category, featured, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Project.countDocuments(filter);

    res.status(200).json({ success: true, data: projects, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Create project
// @route   POST /api/projects
exports.createProject = async (req, res, next) => {
  try {
    const { title, description, shortDescription, category, client, technologies, projectUrl, featured, status, order } = req.body;

    const projectData = { title, description, shortDescription, category, client, projectUrl, featured, status, order };

    if (technologies) {
      projectData.technologies = typeof technologies === 'string' ? technologies.split(',').map(t => t.trim()) : technologies;
    }

    // Handle media uploads
    if (req.files && req.files.length > 0) {
      const images = [];
      const videos = [];
      
      req.files.forEach(file => {
        const isVideo = file.mimetype.startsWith('video');
        const mediaObj = {
          url: file.path,
          publicId: file.filename,
          alt: title || 'Project Media',
        };
        
        if (isVideo) {
          videos.push(mediaObj);
        } else {
          images.push(mediaObj);
        }
      });

      if (images.length > 0) {
        projectData.images = images;
        projectData.thumbnail = { url: images[0].url, publicId: images[0].publicId };
      }
      if (videos.length > 0) {
        projectData.videos = videos;
      }
    }

    const project = await Project.create(projectData);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const updateData = { ...req.body };

    if (updateData.technologies && typeof updateData.technologies === 'string') {
      updateData.technologies = updateData.technologies.split(',').map(t => t.trim());
    }

    // Handle new media uploads
    if (req.files && req.files.length > 0) {
      const newImages = [];
      const newVideos = [];
      
      req.files.forEach(file => {
        const isVideo = file.mimetype.startsWith('video');
        const mediaObj = {
          url: file.path,
          publicId: file.filename,
          alt: updateData.title || project.title,
        };
        
        if (isVideo) {
          newVideos.push(mediaObj);
        } else {
          newImages.push(mediaObj);
        }
      });

      if (newImages.length > 0) {
        updateData.images = [...(project.images || []), ...newImages];
        if (!project.thumbnail || !project.thumbnail.url) {
          updateData.thumbnail = { url: newImages[0].url, publicId: newImages[0].publicId };
        }
      }
      if (newVideos.length > 0) {
        updateData.videos = [...(project.videos || []), ...newVideos];
      }
    }

    project = await Project.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Delete images from Cloudinary
    if (project.images && project.images.length > 0) {
      for (const img of project.images) {
        if (img.publicId) {
          try { await cloudinary.uploader.destroy(img.publicId); } catch (e) { /* ignore */ }
        }
      }
    }

    // Delete videos from Cloudinary
    if (project.videos && project.videos.length > 0) {
      for (const vid of project.videos) {
        if (vid.publicId) {
          try { await cloudinary.uploader.destroy(vid.publicId, { resource_type: 'video' }); } catch (e) { /* ignore */ }
        }
      }
    }

    await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project image
// @route   DELETE /api/projects/:id/images/:imageIndex
exports.deleteProjectImage = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const imageIndex = parseInt(req.params.imageIndex);
    if (imageIndex < 0 || imageIndex >= project.images.length) {
      return res.status(400).json({ error: 'Invalid image index' });
    }

    const image = project.images[imageIndex];
    if (image.publicId) {
      try { await cloudinary.uploader.destroy(image.publicId); } catch (e) { /* ignore */ }
    }

    project.images.splice(imageIndex, 1);
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project video
// @route   DELETE /api/projects/:id/videos/:videoIndex
exports.deleteProjectVideo = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const videoIndex = parseInt(req.params.videoIndex);
    if (videoIndex < 0 || videoIndex >= project.videos.length) {
      return res.status(400).json({ error: 'Invalid video index' });
    }

    const video = project.videos[videoIndex];
    if (video.publicId) {
      try { await cloudinary.uploader.destroy(video.publicId, { resource_type: 'video' }); } catch (e) { /* ignore */ }
    }

    project.videos.splice(videoIndex, 1);
    await project.save();

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};
