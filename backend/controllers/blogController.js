const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinary');

// @desc    Get all blogs
// @route   GET /api/blogs
exports.getBlogs = async (req, res, next) => {
  try {
    const { status, category, tag, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (tag) filter.tags = { $in: [tag] };

    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);

    res.status(200).json({ success: true, data: blogs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blog by slug (public)
// @route   GET /api/blogs/slug/:slug
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: 'Blog not found' });
    blog.views += 1;
    await blog.save();
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/blogs
exports.createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, author, tags, category, status } = req.body;
    const blogData = { title, content, excerpt, author, category, status };

    if (tags) {
      blogData.tags = typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags;
    }

    if (req.file) {
      blogData.coverImage = { url: req.file.path, publicId: req.file.filename };
    }

    const blog = await Blog.create(blogData);
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    const updateData = { ...req.body };
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(t => t.trim());
    }

    if (req.file) {
      if (blog.coverImage && blog.coverImage.publicId) {
        try { await cloudinary.uploader.destroy(blog.coverImage.publicId); } catch (e) { /* ignore */ }
      }
      updateData.coverImage = { url: req.file.path, publicId: req.file.filename };
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog not found' });

    if (blog.coverImage && blog.coverImage.publicId) {
      try { await cloudinary.uploader.destroy(blog.coverImage.publicId); } catch (e) { /* ignore */ }
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    next(error);
  }
};
