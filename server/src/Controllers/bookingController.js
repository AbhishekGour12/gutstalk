import Booking from '../Models/Booking.js';
import Availability from '../Models/Availablity.js';
import MCQ from '../Models/MCQ.js';
import User from '../Models/User.js';
import { createZoomMeetingLink } from '../services/zoomMeet.js';
import crypto from 'crypto';

// Helper: format phone with +91
const formatPhone = (phone) => {
  let cleaned = phone.toString().replace(/\D/g, '');
  if (cleaned.length === 10) return `+91${cleaned}`;
  if (cleaned.length === 12 && cleaned.startsWith('91')) return `+${cleaned}`;
  if (cleaned.length === 13 && cleaned.startsWith('+')) return cleaned;
  return `+91${cleaned.slice(-10)}`;
};

// Initiate booking after payment (with user details)
export const initiateBooking = async (req, res) => {
  try {
    const { date, startTime, endTime, price, paymentDetails, userDetails } = req.body;
    const userId = req.user?._id;
    let finalUserId = userId;
    let guestInfo = null;
    let formattedPhone = null;

    // 1. Check if slot is already booked (by checking Availability's bookedSlots)
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    const availability = await Availability.findOne({ date: targetDate });
    if (availability) {
      const isSlotBooked = availability.bookedSlots.some(slot => slot.startTime === startTime);
      if (isSlotBooked) {
        return res.status(409).json({ error: 'This time slot is no longer available. Please choose another slot.' });
      }
    } else {
      return res.status(404).json({ error: 'No availability found for this date.' });
    }

    // 2. Handle user (logged-in or guest)
    if (!userId && userDetails && userDetails.phone) {
      formattedPhone = formatPhone(userDetails.phone);
      let user = await User.findOne({ phone: formattedPhone });
      
      if (!user) {
        user = new User({
          phone: formattedPhone,
          name: userDetails.name,
          email: userDetails.email,
          isProfileComplete: true,
          totalConsultations: 0,
          consultationHistory: []
        });
        await user.save();
      } else {
        if (userDetails.name && !user.name) user.name = userDetails.name;
        if (userDetails.email && !user.email) user.email = userDetails.email;
        await user.save();
      }
      finalUserId = user._id;
      guestInfo = {
        name: userDetails.name,
        email: userDetails.email,
        phone: formattedPhone
      };
    } else if (userId) {
      // Update logged-in user's info
      await User.findByIdAndUpdate(userId, {
        $inc: { totalConsultations: 1 },
        $set: { 
          name: userDetails?.name || req.user.name,
          email: userDetails?.email || req.user.email
        }
      });
    }

    // 3. Create booking
    const bookingId = `BOOK-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const booking = new Booking({
      bookingId,
      userId: finalUserId,
      guestName: guestInfo?.name,
      guestEmail: guestInfo?.email,
      guestPhone: guestInfo?.phone,
      date: targetDate,
      startTime,
      endTime,
      price,
      paymentStatus: 'paid',
      paymentDetails,
      status: 'scheduled'
    });
    await booking.save();

    // 4. Generate meeting link
    const meetLink = await createZoomMeetingLink(booking);
    booking.meetLink = meetLink;
    await booking.save();

    // 5. Update Availability: mark this slot as booked
    await Availability.findOneAndUpdate(
      { date: targetDate },
      { $push: { bookedSlots: { startTime, endTime, bookingId } } }
    );
    if (global.io) {
    global.io.emit('slot-booked', {
    date: targetDate.toISOString().split('T')[0],
    startTime: startTime,
    endTime: endTime,
    bookingId: bookingId
  });
}

    // 6. Add to user's consultation history
    if (finalUserId) {
      await User.findByIdAndUpdate(finalUserId, {
        $push: {
          consultationHistory: {
            bookingId: booking.bookingId,
            date: targetDate,
            startTime,
            expertName: 'Gut Health Expert',
            meetLink,
            status: 'scheduled'
          }
        }
      });
    }

    res.json({ success: true, bookingId: booking.bookingId, meetLink });
  } catch (error) {
    console.log('❌ initiateBooking error:', error.message);
    res.status(500).json({ error: error.message });
  }
};

// Update booking with user details (after payment, before MCQs)
export const updateBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { name, email, phone } = req.body;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    // Update guest info
    booking.guestName = name;
    booking.guestEmail = email;
    booking.guestPhone = phone;
    await booking.save();

    // If user exists, update user info
    if (booking.userId) {
      await User.findByIdAndUpdate(booking.userId, {
        name, email,
        $inc: { totalConsultations: 1 }
      });
    } else {
      // Create/update user from guest info
      const formattedPhone = formatPhone(phone);
      let user = await User.findOne({ phone: formattedPhone });
      if (!user) {
        user = new User({
          phone: formattedPhone,
          name,
          email,
          isProfileComplete: true,
          totalConsultations: 1
        });
        await user.save();
        booking.userId = user._id;
        await booking.save();
      } else {
        user.name = name;
        user.email = email;
        user.totalConsultations += 1;
        await user.save();
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit MCQ answers
export const submitMCQs = async (req, res) => {
  try {
    const { bookingId, answers } = req.body;
    const booking = await Booking.findOne({ bookingId });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.mcqAnswers = answers;
    await booking.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get MCQs
export const getMCQs = async (req, res) => {
  try {
    const mcqs = await MCQ.find({ isActive: true }).sort('order');
    res.json(mcqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all bookings for logged-in user
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("Fetching bookings for user ID:", userId);
    const bookings = await Booking.find({ 
      userId, 
      status: { $ne: 'cancelled' } 
    }).sort({ date: -1, startTime: -1 });
    
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};