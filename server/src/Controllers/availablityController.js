import Availability from '../Models/Availablity.js';
import Booking from '../Models/Booking.js';


// Helper: parse time (minutes since midnight)
const parseTime = (timeStr) => {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
};
const formatTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
};

// Get available slots for a given date (only slots with no existing booking)
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
  

   const startOfDay = new Date(date + "T00:00:00.000Z");
const endOfDay = new Date(date + "T23:59:59.999Z");

const availability = await Availability.findOne({
  date: {
    $gte: startOfDay,
    $lte: endOfDay
  },
  isActive: true
});

    if (!availability) return res.json({ slots: [] });

    const { startTime, endTime, slotDuration, breakBetweenSlots, bookedSlots = [] } = availability;

    const slots = [];
    let current = parseTime(startTime);
    const end = parseTime(endTime);

    // Create a set of booked start times for quick lookup
    const bookedStartTimes = new Set(bookedSlots.map(slot => slot.startTime));

    while (current < end) {
      const slotEnd = current + slotDuration;
      if (slotEnd > end) break;

      const startTimeStr = formatTime(current);
      const isBooked = bookedStartTimes.has(startTimeStr);

      slots.push({
        start: startTimeStr,
        end: formatTime(slotEnd),
        isAvailable: !isBooked,
        remaining: isBooked ? 0 : 1
      });

      current = slotEnd + breakBetweenSlots;
    }

    res.json({ slots });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin: create or update availability (maxBookingsPerSlot forced to 1)
export const setAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, slotDuration, breakBetweenSlots } = req.body;
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    // Force maxBookingsPerSlot = 1 (one booking per slot)
    const availability = await Availability.findOneAndUpdate(
      { date: targetDate },
      { startTime, endTime, slotDuration, breakBetweenSlots, maxBookingsPerSlot: 1, isActive: true },
      { upsert: true, new: true }
    );
    res.json({ success: true, availability });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all availabilities (for admin)
export const getAllAvailabilities = async (req, res) => {
  try {
    const availabilities = await Availability.find({ isActive: true }).sort('date');
    res.json({ availabilities });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete availability
export const deleteAvailability = async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAvailableDates = async (req, res) => {
  try {
    const availabilities = await Availability.find({ isActive: true }).select('date');
    const dates = availabilities.map(a => a.date);
   
    res.json({ dates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Helper functions

function addMinutes(base, mins) {
  return base + mins;
}