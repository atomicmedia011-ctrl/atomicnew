const Project = require('../models/Project');
const Service = require('../models/Service');
const Blog = require('../models/Blog');
const Testimonial = require('../models/Testimonial');
const TeamMember = require('../models/TeamMember');
const Lead = require('../models/Lead');
const Inquiry = require('../models/Inquiry');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [projects, services, blogs, testimonials, teamMembers, leads, inquiries] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Blog.countDocuments(),
      Testimonial.countDocuments(),
      TeamMember.countDocuments(),
      Lead.countDocuments(),
      Inquiry.countDocuments(),
    ]);

    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);
    const recentInquiries = await Inquiry.find().sort({ createdAt: -1 }).limit(5);
    const recentBlogs = await Blog.find().sort({ createdAt: -1 }).limit(5).select('title status createdAt views');

    res.status(200).json({
      success: true,
      data: {
        counts: { projects, services, blogs, testimonials, teamMembers, leads, inquiries },
        recentLeads,
        recentInquiries,
        recentBlogs,
      },
    });
  } catch (error) {
    next(error);
  }
};
