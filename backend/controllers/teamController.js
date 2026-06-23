const TeamMember = require('../models/TeamMember');
const cloudinary = require('../config/cloudinary');

// @desc    Get all team members
// @route   GET /api/team
exports.getTeamMembers = async (req, res, next) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const members = await TeamMember.find(filter).sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: members, total: members.length });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single team member
// @route   GET /api/team/:id
exports.getTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Team member not found' });
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Create team member
// @route   POST /api/team
exports.createTeamMember = async (req, res, next) => {
  try {
    const { name, role, bio, socialLinks, status, order } = req.body;
    const data = { name, role, bio, status, order };

    if (socialLinks) {
      data.socialLinks = typeof socialLinks === 'string' ? JSON.parse(socialLinks) : socialLinks;
    }

    if (req.file) {
      data.avatar = { url: req.file.path, publicId: req.file.filename };
    }

    const member = await TeamMember.create(data);
    res.status(201).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Update team member
// @route   PUT /api/team/:id
exports.updateTeamMember = async (req, res, next) => {
  try {
    let member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Team member not found' });

    const updateData = { ...req.body };
    if (updateData.socialLinks && typeof updateData.socialLinks === 'string') {
      updateData.socialLinks = JSON.parse(updateData.socialLinks);
    }

    if (req.file) {
      if (member.avatar && member.avatar.publicId) {
        try { await cloudinary.uploader.destroy(member.avatar.publicId); } catch (e) { /* ignore */ }
      }
      updateData.avatar = { url: req.file.path, publicId: req.file.filename };
    }

    member = await TeamMember.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: member });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete team member
// @route   DELETE /api/team/:id
exports.deleteTeamMember = async (req, res, next) => {
  try {
    const member = await TeamMember.findById(req.params.id);
    if (!member) return res.status(404).json({ error: 'Team member not found' });

    if (member.avatar && member.avatar.publicId) {
      try { await cloudinary.uploader.destroy(member.avatar.publicId); } catch (e) { /* ignore */ }
    }

    await TeamMember.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Team member deleted' });
  } catch (error) {
    next(error);
  }
};
