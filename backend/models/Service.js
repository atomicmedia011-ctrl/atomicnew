const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'briefcase',
    },
    image: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    features: [{ type: String }],
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
