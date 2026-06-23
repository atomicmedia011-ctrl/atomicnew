const { validationResult } = require('express-validator');
const Lead = require('../models/Lead');
const { sendAdminNotification, sendClientConfirmation } = require('../utils/sendEmail');
const SiteSettings = require('../models/SiteSettings');
const { sendWhatsAppNotification } = require('../utils/sendWhatsApp');

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Public
exports.createLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, service, budget, message, otpToken } = req.body;

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

    const lead = new Lead({
      name,
      email,
      phone,
      service,
      budget,
      message,
      status: 'New',
      ipAddress,
    });

    await lead.save();

    // Send emails
    await sendAdminNotification(lead, 'lead');
    await sendClientConfirmation(email, name, 'lead');

    // Send WhatsApp notification
    try {
      const settings = await SiteSettings.findOne();
      const wsMessage = `⚛️ *New Lead - ATOMIC MEDIA*\n\n👤 *Name:* ${lead.name}\n✉️ *Email:* ${lead.email}\n📞 *Phone:* ${lead.phone || '—'}\n🛠️ *Service:* ${lead.service}\n💰 *Budget:* ${lead.budget}\n\n💬 *Message:* "${lead.message.length > 100 ? lead.message.substring(0, 100) + '...' : lead.message}"`;
      await sendWhatsAppNotification(wsMessage, settings);
    } catch (wsError) {
      console.error('Failed to send WhatsApp lead notification:', wsError.message);
    }

    res.status(201).json({
      message: 'Lead created successfully',
      lead: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (admin)
// @route   GET /api/leads
// @access  Private (Admin)
exports.getAllLeads = async (req, res, next) => {
  try {
    const { status, service, search, sortBy = '-createdAt' } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (service) filter.service = service;

    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    const leads = await Lead.find(filter).sort(sortBy);

    res.status(200).json({
      count: leads.length,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead (admin)
// @route   GET /api/leads/:id
// @access  Private (Admin)
exports.getSingleLead = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.status(200).json(lead);
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead status (admin)
// @route   PATCH /api/leads/:id
// @access  Private (Admin)
exports.updateLeadStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;

    if (!['New', 'Contacted', 'Converted', 'Rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    lead.status = status;
    if (notes) lead.notes = notes;

    await lead.save();

    res.status(200).json({
      message: 'Lead updated successfully',
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead (admin)
// @route   DELETE /api/leads/:id
// @access  Private (Admin)
exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    res.status(200).json({
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
