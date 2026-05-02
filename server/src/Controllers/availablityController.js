import Slot from '../Models/Slot.js';
import TempSlotHold from '../Models/TempSlotHold.js';

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

// Generate slots for a given date range
export const generateSlots = async (req, res) => {
  try {
    const { startDate, endDate, startTime, endTime, slotDuration, breakBetweenSlots } = req.body;
    
    if (!startDate || !endDate || !startTime || !endTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse the date strings directly - no timezone conversion
    const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
    const [endYear, endMonth, endDay] = endDate.split('-').map(Number);
    
    const start = new Date(Date.UTC(startYear, startMonth - 1, startDay, 0, 0, 0));
    const end = new Date(Date.UTC(endYear, endMonth - 1, endDay, 0, 0, 0));
    
    const dates = [];
    for (let d = new Date(start); d <= end; d.setUTCDate(d.getUTCDate() + 1)) {
      dates.push(new Date(d));
    }

    let createdCount = 0;
    let skippedCount = 0;

    for (const date of dates) {
      // Store the date as UTC midnight (no timezone shift)
      const targetDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
      
      // Generate time slots
      let current = parseTime(startTime);
      const end = parseTime(endTime);
      
      while (current < end) {
        const slotEnd = current + slotDuration;
        if (slotEnd > end) break;
        
        const startTimeStr = formatTime(current);
        const endTimeStr = formatTime(slotEnd);
        
        try {
          const existingSlot = await Slot.findOne({ 
            date: targetDate, 
            startTime: startTimeStr 
          });
          
          if (!existingSlot) {
            const newSlot = new Slot({
              date: targetDate,
              startTime: startTimeStr,
              endTime: endTimeStr,
              isBooked: false
            });
            await newSlot.save();
            createdCount++;
          } else {
            skippedCount++;
          }
        } catch (err) {
          console.error('Error creating slot:', err);
        }
        
        current = slotEnd + breakBetweenSlots;
      }
    }

    res.json({ 
      success: true, 
      created: createdCount, 
      skipped: skippedCount
    });
  } catch (error) {
    console.error('generateSlots error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get available slots for a date (not booked, not held)
export const getAvailableSlots = async (req, res) => {
  try {
    const { date, userId } = req.query;
    if (!date) return res.status(400).json({ error: 'Date required' });

    const startOfDay = new Date(date + "T00:00:00.000Z");
    const endOfDay = new Date(date + "T23:59:59.999Z");

    // Get all slots for the date that are not booked
    const slots = await Slot.find({
      date: { $gte: startOfDay, $lte: endOfDay },
      isBooked: false
    }).sort('startTime');

    // Check temporary holds
    const heldSlots = await TempSlotHold.find({ 
      date: { $gte: startOfDay, $lte: endOfDay } 
    });
    const heldMap = new Map();
    heldSlots.forEach(h => heldMap.set(h.startTime, h.userId));

    const availableSlots = slots.map(slot => ({
      start: slot.startTime,
      end: slot.endTime,
      isBooked: slot.isBooked,
      isHeld: heldMap.has(slot.startTime),
      heldByCurrentUser: userId && heldMap.get(slot.startTime) === userId,
      isAvailable: !slot.isBooked && !heldMap.has(slot.startTime)
    }));

    res.json({ slots: availableSlots });
  } catch (error) {
    console.error("getAvailableSlots error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all slots (admin)
export const getAllSlots = async (req, res) => {
  try {
    const slots = await Slot.find().sort({ date: 1, startTime: 1 });
    
    // Group by date
    const grouped = {};
    slots.forEach(slot => {
      const dateStr = slot.date.toISOString().split('T')[0];
      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(slot);
    });
    
    res.json({ slots: grouped });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a specific slot by ID
export const deleteSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const slot = await Slot.findById(id);
    if (!slot) return res.status(404).json({ error: 'Slot not found' });
    if (slot.isBooked) {
      return res.status(400).json({ error: 'Cannot delete booked slot' });
    }
    await Slot.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete all slots for a date range
export const deleteSlotsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start and end date required' });
    }
    
    const start = new Date(startDate + "T00:00:00.000Z");
    const end = new Date(endDate + "T23:59:59.999Z");
    
    const result = await Slot.deleteMany({
      date: { $gte: start, $lte: end },
      isBooked: false
    });
    
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hold a slot temporarily
export const holdSlot = async (req, res) => {
  try {
    const { date, startTime, userId } = req.body;
    if (!date || !startTime || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    // Check if slot exists and is not already booked
    const slot = await Slot.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      startTime: startTime,
      isBooked: false
    });
    
    if (!slot) {
      return res.status(404).json({ error: 'Slot not available' });
    }

    // Check if slot is on temporary hold by someone else
    const existingHold = await TempSlotHold.findOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      startTime
    });
    if (existingHold && existingHold.userId !== userId) {
      return res.status(409).json({ error: 'Slot is being booked by another user. Please try again.' });
    }

    // Create or update hold (upsert)
    await TempSlotHold.findOneAndUpdate(
      { date: startOfDay, startTime },
      { userId, createdAt: new Date() },
      { upsert: true }
    );

    // Broadcast to all clients
    if (global.io) {
      global.io.emit('slot-held', { date, startTime });
    }

    res.json({ success: true, message: 'Slot held for 5 minutes' });
  } catch (error) {
    console.error('holdSlot error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Release a slot temporarily (called when user cancels or payment fails)
export const releaseSlot = async (req, res) => {
  try {
    const { date, startTime, userId } = req.body;
    if (!date || !startTime || !userId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const [year, month, day] = date.split('-').map(Number);
    const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

    const result = await TempSlotHold.deleteOne({
      date: { $gte: startOfDay, $lte: endOfDay },
      startTime,
      userId
    });

    if (global.io) {
      global.io.emit('slot-released', { date, startTime });
    }

    res.json({ success: true, deleted: result.deletedCount });
  } catch (error) {
    console.error('releaseSlot error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all dates that have available slots
export const getAvailableDates = async (req, res) => {
  try {
    const slots = await Slot.aggregate([
      { $match: { isBooked: false } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } } } },
      { $sort: { _id: 1 } }
    ]);
    const dates = slots.map(s => s._id);
    res.json({ dates });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};