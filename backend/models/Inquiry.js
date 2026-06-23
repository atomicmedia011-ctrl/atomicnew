const mongoose = require('mongoose');

const inquirySchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    businessName: {
      type: String,
      required: [true, 'Please provide your business name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      match: [/^[0-9\+\-\s\(\)]+$/, 'Please provide a valid phone number'],
    },
    websiteType: {
      type: String,
      required: [true, 'Please select a website type'],
      enum: [
        'E-commerce',
        'Corporate Website',
        'Portfolio',
        'SaaS Platform',
        'Blog',
        'Community',
        'Other',
      ],
    },
    requirements: {
      type: String,
      required: [true, 'Please describe your requirements'],
      minlength: [20, 'Requirements must be at least 20 characters'],
      maxlength: [3000, 'Requirements must not exceed 3000 characters'],
    },
    budget: {
      type: String,
      required: [true, 'Please select a budget range'],
      enum: ['Under $5K', '$5K - $10K', '$10K - $25K', '$25K - $50K', '$50K+', 'Not sure'],
    },
    deadline: {
      type: String,
      required: [true, 'Please provide a deadline'],
      enum: ['ASAP', '1-2 months', '3-6 months', '6+ months', 'Flexible'],
    },
    contactDetails: {
      type: {
        website: String,
        company: String,
        location: String,
      },
      default: {},
    },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Converted', 'Rejected'],
      default: 'New',
    },
    notes: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', inquirySchema);
