const crypto = require('crypto');
const Otp = require('../models/Otp');
const { sendOtpEmail } = require('../utils/sendEmail');

// Generate 6-digit OTP
const generateNumericOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Send OTP code to email
// @route   POST /api/otp/send
// @access  Public
exports.sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Please provide an email address' });
    }

    const code = generateNumericOtp();

    // Delete any old active OTPs for this email
    await Otp.deleteMany({ email });

    // Save new OTP code
    await Otp.create({
      email,
      otp: code,
    });

    // Send the OTP via email
    await sendOtpEmail(email, code);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP code
// @route   POST /api/otp/verify
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Please provide email and verification code' });
    }

    // Find the OTP
    const otpRecord = await Otp.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid verification code or code expired' });
    }

    // Generate temporary verification token
    const token = crypto.randomBytes(32).toString('hex');

    // Save token to this record and extend lifespan briefly
    otpRecord.token = token;
    // We save the token for lookup when the form actually submits
    await otpRecord.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully',
      token, // Return to client to include in subsequent form submission
    });
  } catch (error) {
    next(error);
  }
};

// Helper middleware/check to verify the OTP token on form submit
exports.verifyTokenHelper = async (email, token) => {
  if (!email || !token) return false;
  // Look up verification token for this email
  const record = await Otp.findOne({ email, token });
  if (!record) return false;

  // Consume/Delete verification token immediately so it cannot be used again
  await Otp.deleteOne({ _id: record._id });
  return true;
};
