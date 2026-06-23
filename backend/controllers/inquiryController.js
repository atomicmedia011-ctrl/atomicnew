const { validationResult } = require('express-validator');
const Inquiry = require('../models/Inquiry');
const { sendAdminNotification, sendClientConfirmation } = require('../utils/sendEmail');
const SiteSettings = require('../models/SiteSettings');
const { sendWhatsAppNotification } = require('../utils/sendWhatsApp');

// @desc    Create a new project inquiry
// @route   POST /api/inquiries
// @access  Public
exports.createInquiry = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      clientName,
      businessName,
      email,
      phone,
      websiteType,
      requirements,
      budget,
      deadline,
      contactDetails,
      otpToken,
    } = req.body;

    // Check if OTP is required
    const settings = await SiteSettings.findOne();
    if (settings && settings.otpRequired) {
      const { verifyTokenHelper } = require('./otpController');
      const isVerified = await verifyTokenHelper(email, otpToken);
      if (!isVerified) {
        return res.status(400).json({ error: 'Email verification code is missing or invalid' });
      }
    }

    // Get client IP
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;

    const inquiry = new Inquiry({
      clientName,
      businessName,
      email,
      phone,
      websiteType,
      requirements,
      budget,
      deadline,
      contactDetails: contactDetails || {},
      status: 'New',
      ipAddress,
    });

    await inquiry.save();

    // Send emails
    await sendAdminNotification(inquiry, 'inquiry');
    await sendClientConfirmation(email, clientName, 'inquiry');

    // Send WhatsApp notification
    try {
      const settings = await SiteSettings.findOne();
      const wsMessage = `⚛️ *New Project Inquiry - ATOMIC MEDIA*\n\n👤 *Client:* ${inquiry.clientName}\n🏢 *Business:* ${inquiry.businessName || '—'}\n✉️ *Email:* ${inquiry.email}\n📞 *Phone:* ${inquiry.phone || '—'}\n🖥️ *Project Type:* ${inquiry.websiteType}\n💰 *Budget:* ${inquiry.budget}\n⏱️ *Deadline:* ${inquiry.deadline}\n\n💬 *Requirements:* "${inquiry.requirements.length > 100 ? inquiry.requirements.substring(0, 100) + '...' : inquiry.requirements}"`;
      await sendWhatsAppNotification(wsMessage, settings);
    } catch (wsError) {
      console.error('Failed to send WhatsApp inquiry notification:', wsError.message);
    }

    res.status(201).json({
      message: 'Project inquiry created successfully',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all inquiries (admin)
// @route   GET /api/inquiries
// @access  Private (Admin)
exports.getAllInquiries = async (req, res, next) => {
  try {
    const { status, websiteType, search, sortBy = '-createdAt' } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (websiteType) filter.websiteType = websiteType;

    if (search) {
      filter.$or = [
        { clientName: new RegExp(search, 'i') },
        { businessName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const inquiries = await Inquiry.find(filter).sort(sortBy);

    res.status(200).json({
      count: inquiries.length,
      inquiries,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single inquiry (admin)
// @route   GET /api/inquiries/:id
// @access  Private (Admin)
exports.getSingleInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.status(200).json(inquiry);
  } catch (error) {
    next(error);
  }
};

// @desc    Update inquiry status (admin)
// @route   PATCH /api/inquiries/:id
// @access  Private (Admin)
exports.updateInquiryStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (!['New', 'Contacted', 'Converted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    inquiry.status = status;
    if (notes) inquiry.notes = notes;

    await inquiry.save();

    res.status(200).json({
      message: 'Inquiry updated successfully',
      inquiry,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inquiry (admin)
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
exports.deleteInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);

    if (!inquiry) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }

    res.status(200).json({
      message: 'Inquiry deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
