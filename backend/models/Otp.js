const mongoose = require('mongoose');

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email address'],
    trim: true,
  },
  otp: {
    type: String,
    required: [true, 'Please add the OTP code'],
  },
  token: {
    type: String, // Temporary verification token returned upon successful OTP verification
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Expires in 300 seconds (5 minutes)
  },
});

module.exports = mongoose.model('Otp', OtpSchema);
