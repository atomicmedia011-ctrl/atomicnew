const Booking = require('../models/Booking');
const { sendBookingConfirmation, sendBookingAdminNotification } = require('../utils/sendEmail');
const { sendWhatsAppNotification } = require('../utils/sendWhatsApp');
const SiteSettings = require('../models/SiteSettings');

// @desc    Create a new booking/meeting slot
// @route   POST /api/bookings
// @access  Public
exports.createBooking = async (req, res, next) => {
  try {
    const { clientName, email, phone, dateTime, notes } = req.body;

    if (!clientName || !email || !dateTime) {
      return res.status(400).json({ error: 'Please provide clientName, email, and dateTime' });
    }

    // Check if slot is in the past
    if (new Date(dateTime) < new Date()) {
      return res.status(400).json({ error: 'Cannot book meetings in the past' });
    }

    const booking = new Booking({
      clientName,
      email,
      phone,
      dateTime,
      notes,
    });

    await booking.save();

    // Send notifications
    await sendBookingConfirmation(booking);
    await sendBookingAdminNotification(booking);

    // Send WhatsApp notification
    try {
      const settings = await SiteSettings.findOne();
      const dateStr = new Date(booking.dateTime).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      const timeStr = new Date(booking.dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const wsMessage = `⚛️ *New Meeting Booked - ATOMIC MEDIA*\n\n👤 *Client:* ${booking.clientName}\n✉️ *Email:* ${booking.email}\n📞 *Phone:* ${booking.phone || '—'}\n⏱️ *Time:* ${dateStr} at ${timeStr}\n💬 *Notes:* "${booking.notes || '—'}"`;
      await sendWhatsAppNotification(wsMessage, settings);
    } catch (wsError) {
      console.error('Failed to send WhatsApp booking notification:', wsError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res, next) => {
  try {
    const { status, sortBy = 'dateTime' } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const bookings = await Booking.find(filter).sort(sortBy);

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (admin)
// @route   PATCH /api/bookings/:id
// @access  Private (Admin)
exports.updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid booking status' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking status updated to ${status}`,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete booking (admin)
// @route   DELETE /api/bookings/:id
// @access  Private (Admin)
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
