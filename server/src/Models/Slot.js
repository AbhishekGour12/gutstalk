// Models/Slot.js
import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    required: true,
    // Store as UTC midnight, no timezone conversion
    get: (date) => {
      if (!date) return date;
      return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    }
  },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  isBooked: { type: Boolean, default: false },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  price: { type: Number, default: 99 },
  createdAt: { type: Date, default: Date.now }
});

slotSchema.index({ date: 1, startTime: 1 }, { unique: true });

export default mongoose.model('Slot', slotSchema);