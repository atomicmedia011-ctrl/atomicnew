const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
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
    service: {
      type: String,
      required: [true, 'Please select a service'],
      enum: [
        'Web Development',
        'Mobile App',
        'UI/UX Design',
        'Branding',
        'SEO',
        'Content Writing',
        'Digital Marketing',
        'Other',
      ],
    },
    budget: {
      type: String,
      required: [true, 'Please select a budget range'],
      enum: ['Under $5K', '$5K - $10K', '$10K - $25K', '$25K - $50K', '$50K+'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: [2000, 'Message must not exceed 2000 characters'],
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

module.exports = mongoose.model('Lead', leadSchema);
